<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerApplication;
use App\Models\ContactMessage;
use App\Models\PageView;
use App\Models\QuoteRequest;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Pesan masuk, statistik pengunjung, dan unggah gambar untuk panel admin.
 */
class InboxController extends Controller
{
    private const TYPES = [
        'career_applications' => CareerApplication::class,
        'reviews' => Review::class,
        'contact_messages' => ContactMessage::class,
        'quote_requests' => QuoteRequest::class,
    ];

    private function model(string $type): string
    {
        return self::TYPES[$type] ?? abort(404);
    }

    public function index(string $type): JsonResponse
    {
        return response()->json($this->model($type)::orderByDesc('created_at')->limit(300)->get());
    }

    public function unread(): JsonResponse
    {
        $out = [];
        foreach (['career_applications', 'reviews'] as $t) {
            $out[$t] = self::TYPES[$t]::where('is_read', false)->count();
        }

        return response()->json($out);
    }

    /** Tandai dibaca / belum dibaca untuk satu atau banyak pesan. */
    public function markRead(Request $request, string $type): JsonResponse
    {
        $data = $request->validate(['ids' => 'required|array', 'ids.*' => 'integer', 'is_read' => 'required|boolean']);
        $this->model($type)::whereIn('id', $data['ids'])->update(['is_read' => $data['is_read']]);

        return response()->json(['ok' => true]);
    }

    public function destroy(string $type, int $id): JsonResponse
    {
        $this->model($type)::findOrFail($id)->delete();

        return response()->json(['ok' => true]);
    }

    public function stats(Request $request): JsonResponse
    {
        $since = Carbon::parse($request->validate(['since' => 'required|date'])['since']);

        return response()->json([
            'views' => PageView::where('created_at', '>=', $since)->orderBy('created_at')->limit(50000)
                ->get(['created_at', 'visitor_id', 'session_id', 'path', 'source', 'medium', 'device', 'lang', 'campaign']),
            'applications' => CareerApplication::where('created_at', '>=', $since)->count(),
            'reviews' => Review::where('created_at', '>=', $since)->count(),
        ]);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file|max:30720|mimes:jpg,jpeg,png,webp,gif,svg,avif']);
        $file = $request->file('file');
        $base = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'gambar';
        $name = now()->format('Uv').Str::lower(Str::random(4)).'-'.Str::limit($base, 40, '').'.'.strtolower($file->extension() ?: $file->getClientOriginalExtension());
        $path = $file->storeAs('site-media', $name, 'public');

        return response()->json(['url' => Storage::disk('public')->url($path)], 201);
    }
}
