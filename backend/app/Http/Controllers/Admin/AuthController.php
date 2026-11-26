<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        $user = User::whereRaw('lower(email) = ?', [strtolower($data['email'])])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'Email atau kata sandi salah.']);
        }

        return response()->json([
            'token' => $user->createToken('admin')->plainTextToken,
            'user' => ['name' => $user->name, 'email' => $user->email],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['name' => $request->user()->name, 'email' => $request->user()->email]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['ok' => true]);
    }
}
