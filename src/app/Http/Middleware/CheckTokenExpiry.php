<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;
use Laravel\Sanctum\PersonalAccessToken;
use App\Exceptions\CustomException;

class CheckTokenExpiry
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Retrieve the token from the request
        $token = $request->bearerToken();

        // Get the token instance from the database
        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken || ($accessToken->expires_at && Carbon::now()->greaterThan($accessToken->expires_at))) {
            throw new CustomException('ERR_INVALID_TOKEN', 'invalid token', 401);
        }

        return $next($request);
    }
}
