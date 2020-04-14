package handler

import (
	"github.com/go-redis/redis/v7"
	"github.com/jinzhu/gorm"
)

type Handler struct {
	db          *gorm.DB
	redisClient *redis.Client
}

func NewHandler(db *gorm.DB, redisClient *redis.Client) *Handler {
	return &Handler{
		db:          db,
		redisClient: redisClient,
	}
}
