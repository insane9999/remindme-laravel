<?php

namespace App\Http\Controllers;

use App\Exceptions\CustomException;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Laravel\Sanctum\PersonalAccessToken;
use Ramsey\Uuid\Uuid;

class AuthController extends Controller
{

    use ApiResponseTrait;

    private function generate_tokens($user)
    {
        // Create Access Token
        $accessToken = $user->createToken('access_token');
        $accessExpiresAt = Carbon::now()->addSeconds(env('ACCESS_TOKEN_EXPIRATION', 20));
        $accessToken->accessToken->expires_at = $accessExpiresAt;
        $accessToken->accessToken->save();

        $refreshToken = Uuid::uuid4()->toString();
        $refreshExpiresAt = Carbon::now()->addDays(env('REFRESH_TOKEN_EXPIRATION', 7));
        $accessToken->accessToken->refresh_token = $refreshToken;
        $accessToken->accessToken->refresh_token_expires_at = $refreshExpiresAt;
        $accessToken->accessToken->save();

        return [
            'access_token' => $accessToken->plainTextToken,
            'refresh_token' => $refreshToken
        ];
    }

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $credentials = $request->only('email', 'password');

        if (!auth()->attempt($credentials)) {
            throw new CustomException(
                'ERR_INVALID_CREDS',
                'Incorrect username or password',
                401
            );
        }

        $user = auth()->user();

        $tokens = $this->generate_tokens($user);

        return $this->success(
            [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                ],
                'access_token' => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token']
            ]
        );
    }

    // Refresh Access Token
    public function refresh(Request $request)
    {
        $refreshToken = $request->bearerToken();

        // Find the token associated with the refresh token
        $token = PersonalAccessToken::where('refresh_token', $refreshToken)->first();

        if (!$token) {
            throw new CustomException(
                'ERR_INVALID_REFRESH_TOKEN',
                'invalid refresh token',
                500
            );
        }

        // Check if the refresh token has expired
        if (Carbon::now()->greaterThan($token->refresh_token_expires_at)) {
            throw new CustomException(
                'ERR_INVALID_REFRESH_TOKEN',
                'refresh token is expired',
                500
            );
        }

        // Retrieve the associated user
        $user = $token->tokenable;

        // Revoke the old access token
        $token->delete();

        $tokens = $this->generate_tokens($user);

        return $this->success([
            'access_token' => $tokens['access_token'],
            'refresh_token' => $tokens['refresh_token']
        ]);
    }
}
