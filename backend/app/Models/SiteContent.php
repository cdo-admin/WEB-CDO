<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    protected $guarded = ['id'];

    protected $hidden = ['lookup', 'id'];

    protected function casts(): array
    {
        return ['position' => 'integer'];
    }

    public static function lookupFor(string $kind, string $key, string $scope = ''): string
    {
        return sha1($kind."\n".$key."\n".$scope);
    }
}
