<?php

namespace App\Traits;

trait ApiResponseTrait
{
    /**
     * Standardized API response format.
     *
     * @param bool $ok
     * @param object | array $data
     * @param int|null $limit
     * @return \Illuminate\Http\JsonResponse
     */
    public function success($data = null)
    {
        $response = [
            'ok' => true,
        ];
        
        // Only add the 'data' field if $data is not null
        if (!is_null($data)) {
            $response['data'] = $data;
        }

        return response()->json($response);
    }

    public function error($err, $msg, $status)
    {
        $response = [
            'ok' => false,
            'err' => $err,
            'msg' => $msg
        ];

        return response()->json($response, $status);
    }
}