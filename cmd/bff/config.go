package main

import (
	"log"

	"go.sancus.dev/config/flags"
	"go.sancus.dev/config/yaml"
)

type Config struct {
	Port uint16
}

func NewConfig() *Config {
	cfg := &Config{}

	if err := flags.SetDefaults(cfg); err != nil {
		log.Fatal(err)
	}

	return cfg
}

func (cfg *Config) ReadInFile(filename string) error {
	return yaml.LoadFile(filename, cfg)
}
