<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Isi website hasil editor visual (tabel site_contents). Baris diidentifikasi oleh (kind, key, scope).
 */
class SiteContentController extends Controller
{
    private const KINDS = 'text,img,href,hide,clone,config';

    public function index(Request $request): JsonResponse
    {
        $q = SiteContent::query()->select(['kind', 'key', 'scope', 'value_id', 'value_en', 'position', 'updated_at']);
        foreach (['kind', 'key', 'scope'] as $f) {
            if ($request->has($f)) {
                $q->where($f, (string) $request->query($f, ''));
            }
        }

        return response()->json($q->orderBy('position')->get());
    }

    /** Simpan / timpa beberapa baris sekaligus. */
    public function upsert(Request $request): JsonResponse
    {
        $data = $request->validate([
            'rows' => 'required|array|min:1|max:500',
            'rows.*.kind' => 'required|in:'.self::KINDS,
            'rows.*.key' => 'required|string|max:20000',
            'rows.*.scope' => 'nullable|string|max:64',
            'rows.*.value_id' => 'nullable|string',
            'rows.*.value_en' => 'nullable|string',
            'rows.*.position' => 'nullable|integer',
        ]);

        foreach ($data['rows'] as $r) {
            if (in_array($r['kind'], ['img', 'href'], true) && preg_match('/^\s*javascript:/i', (string) ($r['value_id'] ?? ''))) {
                abort(422, 'Link tidak valid');
            }
            $scope = (string) ($r['scope'] ?? '');
            $values = ['kind' => $r['kind'], 'key' => $r['key'], 'scope' => $scope, 'value_id' => $r['value_id'] ?? null, 'value_en' => $r['value_en'] ?? null];
            if (array_key_exists('position', $r)) {
                $values['position'] = (int) $r['position'];
            }
            SiteContent::updateOrCreate(['lookup' => SiteContent::lookupFor($r['kind'], $r['key'], $scope)], $values);
        }

        return response()->json(['ok' => true]);
    }

    /** Hapus baris yang cocok. Wajib menyebut key atau scope agar tidak menghapus semuanya. */
    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kind' => 'nullable|in:'.self::KINDS,
            'key' => 'nullable|string',
            'scope' => 'nullable|string|max:64',
        ]);
        if (! array_key_exists('key', $data) && empty($data['scope'])) {
            abort(422, 'Sebutkan key atau scope.');
        }
        $q = SiteContent::query();
        foreach (['kind', 'key', 'scope'] as $f) {
            if (array_key_exists($f, $data)) {
                $q->where($f, (string) ($data[$f] ?? ''));
            }
        }

        return response()->json(['deleted' => $q->delete()]);
    }
}
