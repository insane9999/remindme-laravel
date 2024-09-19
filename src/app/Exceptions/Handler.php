<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Translation\Exception\NotFoundResourceException;
use \Illuminate\Auth\AuthenticationException;
use Throwable;
use App\Traits\ApiResponseTrait;

class Handler extends ExceptionHandler
{

    use ApiResponseTrait;

    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($exception instanceof CustomException) {
            return $exception->render($request);
        }

        // Handle validation errors (400 Bad Request)
        if ($exception instanceof ValidationException) {
            return $this->error('ERR_BAD_REQUEST', 'invalid value of `type`', 400);
        }

        // Handle unauthorized access (401 Unauthorized)
        if ($exception instanceof UnauthorizedHttpException || $exception instanceof AuthenticationException) {
            return $this->error('ERR_INVALID_ACCESS_TOKEN', 'invalid access token', 401);
        }

        // Handle forbidden access (403 Forbidden)
        if ($exception instanceof AccessDeniedHttpException) {
            return $this->error('ERR_FORBIDDEN_ACCESS', "user doesn't have enough authorization", 403);
        }

        // Handle resource not found (404 Not Found)
        if ($exception instanceof NotFoundResourceException || $exception instanceof NotFoundHttpException) {
            return $this->error('ERR_NOT_FOUND', 'resource is not found', 404);
        }

        return $this->error('ERR_INTERNAL_ERROR', $exception->getMessage(), 500);

        // Default exception handling
        // return parent::render($request, $exception);
    }
}
