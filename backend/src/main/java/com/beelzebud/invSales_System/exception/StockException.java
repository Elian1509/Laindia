package com.beelzebud.invSales_System.exception;

import java.util.List;

public class StockException extends RuntimeException {
    private final List<String> errors;

    public StockException(List<String> errors) {
        super("Errores de stock");
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
