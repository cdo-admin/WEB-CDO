<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

/**
 * Membuat / memperbarui akun admin panel.
 *   php artisan admin:create admin@contoh.com
 */
class CreateAdmin extends Command
{
    protected $signature = 'admin:create {email} {--name=Admin} {--password=}';

    protected $description = 'Buat atau perbarui akun admin panel website';

    public function handle(): int
    {
        $email = strtolower(trim($this->argument('email')));
        $password = $this->option('password') ?: $this->secret('Kata sandi (min. 8 karakter)');
        if (! $password || strlen($password) < 8) {
            $this->error('Kata sandi minimal 8 karakter.');

            return self::FAILURE;
        }

        $user = User::updateOrCreate(['email' => $email], ['name' => $this->option('name'), 'password' => $password]);
        $this->info(($user->wasRecentlyCreated ? 'Admin dibuat: ' : 'Admin diperbarui: ').$email);

        return self::SUCCESS;
    }
}
