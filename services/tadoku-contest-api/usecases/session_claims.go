package usecases

import (
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/domain"
)

// SessionClaims is what we store in the authentication token
// It's cryptographically signed but the contents can be seen by everyone.
// Don't store any sensitive info here
type SessionClaims struct {
	User *domain.User
	Data map[string]interface{}
}
