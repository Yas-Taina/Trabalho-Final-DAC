package dac.ufpr.cliente.exception;

public abstract class CustomException extends RuntimeException {
    private final int httpStatus;

    public CustomException(String message, int httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public int getHttpStatus() {
        return httpStatus;
    }
}
