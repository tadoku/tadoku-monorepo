package infra_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/domain"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/infra"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/interfaces/services"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/usecases"
)

func TestRouter_RestrictedRoute(t *testing.T) {
	handler := func(ctx services.Context) error {
		return ctx.String(200, "test")
	}
	cookieName := "session_cookie"
	secret := "foobar"
	routes := []services.Route{
		{Method: http.MethodGet, Path: "/unrestricted", HandlerFunc: handler},
		{Method: http.MethodGet, Path: "/restricted", HandlerFunc: handler, MinRole: domain.RoleUser},
		{Method: http.MethodGet, Path: "/registered_only", HandlerFunc: handler, MinRole: domain.RoleUser},
		{Method: http.MethodGet, Path: "/admin", HandlerFunc: handler, MinRole: domain.RoleAdmin},
	}
	e := infra.NewRouter(domain.EnvTest, "1337", secret, cookieName, nil, nil, routes...)
	clock, _ := infra.NewClock("UTC")
	gen := infra.NewJWTGenerator(secret, clock)

	for _, tc := range []struct {
		path          string
		expStatusCode int
		user          *domain.User
		info          string
	}{
		{
			path:          "/restricted",
			expStatusCode: http.StatusUnauthorized,
			info:          "Missing JWT",
		},
		{
			path:          "/unrestricted",
			expStatusCode: http.StatusOK,
			info:          "Access to unrestricted page without token",
		},
		{
			path:          "/admin",
			expStatusCode: http.StatusForbidden,
			user:          &domain.User{Role: domain.RoleUser},
			info:          "No admin access as user",
		},
		{
			path:          "/admin",
			expStatusCode: http.StatusOK,
			user:          &domain.User{Role: domain.RoleAdmin},
			info:          "Admin access as admin",
		},
	} {
		token, _, _ := gen.NewToken(time.Hour*1, usecases.SessionClaims{User: tc.user})
		cookie := &http.Cookie{
			Name:     cookieName,
			Value:    token,
			Secure:   true,
			HttpOnly: true,
		}

		req := httptest.NewRequest(http.MethodGet, tc.path, nil)
		req.AddCookie(cookie)

		res := httptest.NewRecorder()

		e.ServeHTTP(res, req)

		assert.Equal(t, tc.expStatusCode, res.Code, tc.info)
	}
}
