package handler

import (
	"github.com/jinzhu/gorm"
	"github.com/mediocregopher/radix/v3"
)

type Handler struct {
	db   *gorm.DB
	pool radix.Client
}

func NewHandler(db *gorm.DB, pool radix.Client) *Handler {
	return &Handler{
		db:   db,
		pool: pool,
	}
}
