<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\InboxController;
use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\Admin\SiteContentController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

// ---------------------------- Publik (website) ----------------------------
Route::get('/site-content', [PublicController::class, 'siteContent']);
Route::get('/jobs', [PublicController::class, 'jobs']);
Route::get('/portfolio', [PublicController::class, 'portfolio']);
Route::get('/gallery', [PublicController::class, 'gallery']);

Route::middleware('throttle:20,1')->group(function () {
    Route::post('/contact-messages', [PublicController::class, 'contact']);
    Route::post('/quote-requests', [PublicController::class, 'quote']);
    Route::post('/career-applications', [PublicController::class, 'career']);
    Route::post('/reviews', [PublicController::class, 'review']);
});
Route::post('/page-views', [PublicController::class, 'pageView'])->middleware('throttle:120,1');

// ------------------------------ Panel admin ------------------------------
Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/site-content', [SiteContentController::class, 'index']);
    Route::put('/site-content', [SiteContentController::class, 'upsert']);
    Route::delete('/site-content', [SiteContentController::class, 'destroy']);

    Route::get('/stats', [InboxController::class, 'stats']);
    Route::post('/media', [InboxController::class, 'upload']);

    Route::get('/inbox/unread', [InboxController::class, 'unread']);
    Route::get('/inbox/{type}', [InboxController::class, 'index']);
    Route::post('/inbox/{type}/read', [InboxController::class, 'markRead']);
    Route::delete('/inbox/{type}/{id}', [InboxController::class, 'destroy'])->whereNumber('id');

    Route::get('/items/{type}', [ItemController::class, 'index']);
    Route::post('/items/{type}', [ItemController::class, 'store']);
    Route::post('/items/{type}/reorder', [ItemController::class, 'reorder']);
    Route::post('/items/{type}/bulk', [ItemController::class, 'bulkUpdate']);
    Route::patch('/items/{type}/{id}', [ItemController::class, 'update'])->whereNumber('id');
    Route::delete('/items/{type}/{id}', [ItemController::class, 'destroy'])->whereNumber('id');
});
