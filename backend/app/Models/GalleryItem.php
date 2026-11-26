<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'sort_order' => 'integer', 'en' => 'array', 'photos' => 'array', 'event_date' => 'date:Y-m-d'];
    }
}
