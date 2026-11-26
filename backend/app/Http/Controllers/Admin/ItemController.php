<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use App\Models\JobOpening;
use App\Models\PortfolioItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Kelola daftar yang bisa diurutkan: lowongan (jobs), portofolio (portfolio), galeri kegiatan (gallery).
 */
class ItemController extends Controller
{
    private const MODELS = ['jobs' => JobOpening::class, 'portfolio' => PortfolioItem::class, 'gallery' => GalleryItem::class];

    private function rules(string $type): array
    {
        $common = ['sort_order' => 'nullable|integer', 'is_active' => 'boolean', 'title' => 'required|string|max:255', 'en' => 'nullable|array'];

        return $common + match ($type) {
            'jobs' => [
                'category' => 'nullable|string|max:255', 'color' => 'nullable|string|max:20', 'location' => 'nullable|string|max:255',
                'description' => 'nullable|string', 'detail1' => 'nullable|string|max:255', 'detail2' => 'nullable|string|max:255',
                'apply_role' => 'nullable|string|max:255',
            ],
            'portfolio' => [
                'category' => 'nullable|string|max:80', 'badge' => 'nullable|string|max:255', 'badge_color' => 'nullable|string|max:20',
                'location' => 'nullable|string|max:255', 'status' => 'nullable|string|max:255', 'status_color' => 'nullable|string|max:20',
                'description' => 'nullable|string', 'foot_left' => 'nullable|string|max:255', 'foot_right' => 'nullable|string|max:255',
                'foot_color' => 'nullable|string|max:20', 'image_url' => 'nullable|string|max:1000', 'image_alt' => 'nullable|string|max:255',
                'detail' => 'nullable|string', 'gallery' => 'nullable|array', 'gallery.*' => 'string|max:1000',
            ],
            'gallery' => [
                'event_date' => 'nullable|date', 'description' => 'nullable|string', 'image_url' => 'nullable|string|max:1000',
                'photos' => 'nullable|array', 'photos.*' => 'string|max:1000',
            ],
        };
    }

    /** @return class-string<Model> */
    private function model(string $type): string
    {
        return self::MODELS[$type] ?? abort(404);
    }

    public function index(string $type): JsonResponse
    {
        $m = $this->model($type);
        $q = $m::query()->orderBy('sort_order');
        $type === 'gallery' ? $q->orderByDesc('id') : $q->orderBy('id');

        return response()->json($q->get());
    }

    public function store(Request $request, string $type): JsonResponse
    {
        $m = $this->model($type);
        $rules = $this->rules($type);
        // impor beberapa sekaligus (data bawaan)
        if ($request->has('items')) {
            $request->validate(['items' => 'required|array|max:100']);
            $created = [];
            foreach ($request->input('items') as $row) {
                $created[] = $m::create(validator($row, $rules)->validate());
            }

            return response()->json($created, 201);
        }

        return response()->json($m::create($request->validate($rules)), 201);
    }

    public function update(Request $request, string $type, int $id): JsonResponse
    {
        $m = $this->model($type);
        $item = $m::findOrFail($id);
        $rules = array_map(fn ($r) => str_replace('required|', 'sometimes|required|', $r), $this->rules($type));
        $item->update($request->validate($rules));

        return response()->json($item->fresh());
    }

    public function destroy(string $type, int $id): JsonResponse
    {
        $this->model($type)::findOrFail($id)->delete();

        return response()->json(['ok' => true]);
    }

    /** Simpan urutan baru: ids dari atas ke bawah. */
    public function reorder(Request $request, string $type): JsonResponse
    {
        $m = $this->model($type);
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'integer'])['ids'];
        foreach (array_values($ids) as $i => $id) {
            $m::whereKey($id)->update(['sort_order' => ($i + 1) * 10]);
        }

        return response()->json(['ok' => true]);
    }

    /** Ubah satu kolom di banyak baris, mis. memindahkan kategori portofolio. */
    public function bulkUpdate(Request $request, string $type): JsonResponse
    {
        $m = $this->model($type);
        $data = $request->validate(['ids' => 'required|array', 'ids.*' => 'integer', 'category' => 'required|string|max:80']);
        $m::whereIn('id', $data['ids'])->update(['category' => $data['category']]);

        return response()->json(['ok' => true]);
    }
}
