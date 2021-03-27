package services_test

import (
	"testing"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"

	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/domain"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/interfaces/services"
	"github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api/usecases"
)

func TestContestService_Create(t *testing.T) {
	contest := &domain.Contest{
		Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
		End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
		Open:  true,
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	ctx := services.NewMockContext(ctrl)
	ctx.EXPECT().NoContent(201)
	ctx.EXPECT().Bind(gomock.Any()).Return(nil).SetArg(0, *contest)

	i := usecases.NewMockContestInteractor(ctrl)
	i.EXPECT().CreateContest(*contest).Return(nil)

	s := services.NewContestService(i)
	err := s.Create(ctx)

	assert.NoError(t, err)
}

func TestContestService_Update(t *testing.T) {
	contest := &domain.Contest{
		ID:    1,
		Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
		End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
		Open:  true,
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	ctx := services.NewMockContext(ctrl)
	ctx.EXPECT().NoContent(204)
	ctx.EXPECT().Bind(gomock.Any()).Return(nil).SetArg(0, *contest)
	ctx.EXPECT().BindID(&contest.ID).Return(nil)

	i := usecases.NewMockContestInteractor(ctrl)
	i.EXPECT().UpdateContest(*contest).Return(nil)

	s := services.NewContestService(i)
	err := s.Update(ctx)

	assert.NoError(t, err)
}

func TestContestService_All(t *testing.T) {
	contests := []domain.Contest{
		{
			ID:    1,
			Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
			End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
			Open:  false,
		},
		{
			ID:    2,
			Start: time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
			End:   time.Date(2020, 1, 31, 0, 0, 0, 0, time.UTC),
			Open:  true,
		},
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	{
		ctx := services.NewMockContext(ctrl)
		ctx.EXPECT().JSON(200, contests[1:])
		ctx.EXPECT().QueryParam("limit").Return("1")

		i := usecases.NewMockContestInteractor(ctrl)
		i.EXPECT().Recent(1).Return(contests[1:], nil)

		s := services.NewContestService(i)
		err := s.All(ctx)

		assert.NoError(t, err)
	}

	{
		ctx := services.NewMockContext(ctrl)
		ctx.EXPECT().QueryParam("limit").Return("")
		ctx.EXPECT().JSON(200, contests)

		i := usecases.NewMockContestInteractor(ctrl)
		i.EXPECT().Recent(0).Return(contests, nil)

		s := services.NewContestService(i)
		err := s.All(ctx)

		assert.NoError(t, err)
	}

	{
		ctx := services.NewMockContext(ctrl)
		ctx.EXPECT().QueryParam("limit").Return("5")
		ctx.EXPECT().NoContent(404)

		i := usecases.NewMockContestInteractor(ctrl)
		i.EXPECT().Recent(5).Return(nil, usecases.ErrContestNotFound)

		s := services.NewContestService(i)
		err := s.All(ctx)

		assert.NoError(t, err)
	}
}

func TestContestService_Get(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	{
		contestID := uint64(1)
		contest := &domain.Contest{
			ID:    contestID,
			Start: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
			End:   time.Date(2019, 1, 31, 0, 0, 0, 0, time.UTC),
			Open:  true,
		}

		ctx := services.NewMockContext(ctrl)
		ctx.EXPECT().BindID(gomock.Any()).Return(nil).SetArg(0, contestID)
		ctx.EXPECT().JSON(200, contest)

		i := usecases.NewMockContestInteractor(ctrl)
		i.EXPECT().Find(contestID).Return(contest, nil)

		s := services.NewContestService(i)
		err := s.Get(ctx)

		assert.NoError(t, err)
	}

	{
		contestID := uint64(1)
		ctx := services.NewMockContext(ctrl)
		ctx.EXPECT().BindID(gomock.Any()).Return(nil).SetArg(0, contestID)
		ctx.EXPECT().NoContent(404)

		i := usecases.NewMockContestInteractor(ctrl)
		i.EXPECT().Find(contestID).Return(nil, usecases.ErrContestNotFound)

		s := services.NewContestService(i)
		err := s.Get(ctx)

		assert.NoError(t, err)
	}
}
