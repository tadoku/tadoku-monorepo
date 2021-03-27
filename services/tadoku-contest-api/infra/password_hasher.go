package infra

import (
	"golang.org/x/crypto/bcrypt"

	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/domain"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/usecases"
)

// NewPasswordHasher initializes a new password hasher with sane defaults
func NewPasswordHasher() usecases.PasswordHasher {
	return &passwordHasher{cost: bcrypt.DefaultCost}
}

type passwordHasher struct {
	cost int
}

func (h *passwordHasher) Hash(value domain.Password) (domain.Password, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(value), h.cost)
	if err != nil {
		return "", domain.WrapError(err)
	}

	return domain.Password(hash), nil
}

func (h *passwordHasher) Compare(hash domain.Password, original string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(original))
	return err == nil
}
