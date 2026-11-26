<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Membuat akun admin awal bila ADMIN_EMAIL & ADMIN_PASSWORD diisi di .env.
     * Isi website (teks, produk, dll.) sudah bawaan di frontend; admin cukup mengubahnya lewat panel.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (! $email || ! $password) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD belum diisi. Buat admin dengan: php artisan admin:create email@anda.com');

            return;
        }

        User::updateOrCreate(['email' => strtolower($email)], ['name' => 'Admin', 'password' => $password]);
        $this->command?->info("Admin siap: {$email}");
    }
}
