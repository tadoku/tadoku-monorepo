package app

import (
	"time"

	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/infra"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/usecases"
)

// Interactors is a collection of all repositories
type Interactors struct {
	Session usecases.SessionInteractor
	Contest usecases.ContestInteractor
	Ranking usecases.RankingInteractor
	User    usecases.UserInteractor
}

// NewInteractors initializes all repositories
func NewInteractors(
	r *Repositories,
	jwtGenerator usecases.JWTGenerator,
	sessionLength time.Duration,
) *Interactors {
	passwordHasher := infra.NewPasswordHasher()

	return &Interactors{
		Session: usecases.NewSessionInteractor(
			r.User,
			passwordHasher,
			jwtGenerator,
			sessionLength,
		),
		Contest: usecases.NewContestInteractor(r.Contest, infra.NewValidator()),
		Ranking: usecases.NewRankingInteractor(r.Ranking, r.Contest, r.ContestLog, r.User, infra.NewValidator()),
		User:    usecases.NewUserInteractor(r.User, passwordHasher),
	}
}
