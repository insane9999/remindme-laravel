<?php

namespace App\Exceptions;

use Exception;
use App\Traits\ApiResponseTrait;

class CustomException extends Exception
{
    use ApiResponseTrait;

    protected $error; 
    protected $message;
    protected $code;

    // Constructor to customize exception
    public function __construct($error, $message, $code)
    {
        parent::__construct($message, $code);
        $this->error = $error;
        $this->message = $message;
        $this->code = $code;
    }

    // Optional: Render the exception to return a JSON response
    public function render($request)
    {
        return $this->error($this->error, $this->message, $this->code);
    }
}
