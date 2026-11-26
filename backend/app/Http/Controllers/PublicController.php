<?php

namespace App\Http\Controllers;

use App\Models\CareerApplication;
use App\Models\ContactMessage;
use App\Models\GalleryItem;
use App\Models\JobOpening;
use App\Models\PageView;
use App\Models\PortfolioItem;
use App\Models\QuoteRequest;
use App\Models\Review;
use App\Models\SiteContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Endpoint publik untuk website (tanpa login): membaca isi CMS dan menerima formulir pengunjung.
 */
class PublicController extends Controller
{
    /** Semua perubahan isi website dari admin (teks, gambar, link, kartu, pengaturan). */
    public function siteContent(): JsonResponse
    {
        $rows = SiteContent::query()
            ->select(['kind', 'key', 'scope', 'value_id', 'value_en', 'position'])
            ->orderBy('position')
            ->limit(5000)
            ->get();

        return response()->json($rows);
    }

    public function jobs(): JsonResponse
    {
        return response()->json([
            'managed' => (bool) ($this->config('careers')['managed'] ?? false),
            'jobs' => JobOpening::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function portfolio(): JsonResponse
    {
        $cfg = $this->config('portfolio');

        return response()->json([
            'managed' => (bool) ($cfg['managed'] ?? false),
            'filters' => is_array($cfg['filters'] ?? null) ? $cfg['filters'] : [],
            'items' => PortfolioItem::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function gallery(): JsonResponse
    {
        return response()->json(
            GalleryItem::where('is_active', true)->orderBy('sort_order')->orderByDesc('id')->get()
        );
    }

    public function contact(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:200',
            'email' => 'required|email|max:200',
            'phone' => 'nullable|string|max:40',
            'company' => 'nullable|string|max:200',
            'subject' => 'nullable|string|max:200',
            'message' => 'required|string|max:5000',
        ]);

        return response()->json(['id' => ContactMessage::create($data)->id], 201);
    }

    public function quote(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:200',
            'email' => 'required|email|max:200',
            'phone' => 'required|string|max:40',
            'company' => 'nullable|string|max:200',
            'client_type' => 'nullable|string|max:120',
            'category' => 'nullable|string|max:200',
            'selected_items' => 'nullable|array|max:200',
            'selected_items.*' => 'string|max:500',
            'estimated_volume' => 'nullable|string|max:20000',
            'delivery_location' => 'nullable|string|max:2000',
            'notes' => 'nullable|string|max:5000',
        ]);

        return response()->json(['id' => QuoteRequest::create($data)->id], 201);
    }

    public function career(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:200',
            'email' => 'required|email|max:200',
            'phone' => 'required|string|max:40',
            'position' => 'required|string|max:200',
            'linkedin_url' => 'nullable|string|max:500',
            'portfolio_url' => 'nullable|string|max:500',
            'cover_letter' => 'nullable|string|max:10000',
        ]);

        return response()->json(['id' => CareerApplication::create($data)->id], 201);
    }

    public function review(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:200',
            'company' => 'nullable|string|max:200',
            'email' => 'nullable|email|max:200',
            'phone' => 'nullable|string|max:40',
            'rating' => 'required|integer|between:1,5',
            'message' => 'required|string|max:3000',
        ]);

        return response()->json(['id' => Review::create($data)->id], 201);
    }

    /** Pelacak pengunjung (tanpa nama / IP). */
    public function pageView(Request $request): JsonResponse
    {
        $data = $request->validate([
            'visitor_id' => 'nullable|string|max:64',
            'session_id' => 'nullable|string|max:64',
            'path' => 'nullable|string|max:299',
            'source' => 'nullable|string|max:79',
            'medium' => 'nullable|string|max:40',
            'referrer_host' => 'nullable|string|max:255',
            'campaign' => 'nullable|string|max:80',
            'device' => 'nullable|string|max:20',
            'lang' => 'nullable|string|max:8',
            'screen_w' => 'nullable|integer|min:0|max:100000',
        ]);
        PageView::create($data);

        return response()->json(['ok' => true], 201);
    }

    private function config(string $key): array
    {
        $row = SiteContent::where('lookup', SiteContent::lookupFor('config', $key))->first();
        $val = $row ? json_decode((string) $row->value_id, true) : null;

        return is_array($val) ? $val : [];
    }
}
