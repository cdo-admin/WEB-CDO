<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabel-tabel website PT. Candi Oxygen (pengganti skema Supabase di folder supabase/).
 */
return new class extends Migration
{
    public function up(): void
    {
        // Isi website yang diedit dari admin. kind: text | img | href | hide | clone | config
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('kind', 20);
            $table->text('key');
            $table->string('scope', 64)->default('');
            $table->char('lookup', 40)->unique(); // sha1(kind|key|scope) — kunci unik (key bisa panjang)
            $table->longText('value_id')->nullable();
            $table->longText('value_en')->nullable();
            $table->bigInteger('position')->default(0);
            $table->timestamps();
            $table->index('scope');
            $table->index('kind');
        });

        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->timestamp('created_at')->useCurrent()->index();
            $table->string('visitor_id', 64)->nullable();
            $table->string('session_id', 64)->nullable();
            $table->string('path', 300)->nullable();
            $table->string('source', 80)->nullable();
            $table->string('medium', 40)->nullable();
            $table->string('referrer_host', 255)->nullable();
            $table->string('campaign', 80)->nullable();
            $table->string('device', 20)->nullable();
            $table->string('lang', 8)->nullable();
            $table->unsignedInteger('screen_w')->nullable();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('full_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 40)->nullable();
            $table->string('company')->nullable();
            $table->string('subject')->nullable();
            $table->text('message')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('quote_requests', function (Blueprint $table) {
            $table->id();
            $table->string('full_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 40)->nullable();
            $table->string('company')->nullable();
            $table->string('client_type')->nullable();
            $table->string('category')->nullable();
            $table->json('selected_items')->nullable();
            $table->text('estimated_volume')->nullable();
            $table->text('delivery_location')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('career_applications', function (Blueprint $table) {
            $table->id();
            $table->string('full_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 40)->nullable();
            $table->string('position')->nullable();
            $table->string('linkedin_url', 500)->nullable();
            $table->string('portfolio_url', 500)->nullable();
            $table->text('cover_letter')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('full_name')->nullable();
            $table->string('company')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 40)->nullable();
            $table->unsignedTinyInteger('rating');
            $table->text('message')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('job_openings', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('title');
            $table->string('category')->nullable();
            $table->string('color', 20)->default('sky');
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->string('detail1')->nullable();
            $table->string('detail2')->nullable();
            $table->string('apply_role')->nullable();
            $table->json('en')->nullable();
            $table->timestamps();
        });

        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('title');
            $table->string('category', 80)->default('industri');
            $table->string('badge')->nullable();
            $table->string('badge_color', 20)->default('navy');
            $table->string('location')->nullable();
            $table->string('status')->nullable();
            $table->string('status_color', 20)->default('emerald');
            $table->text('description')->nullable();
            $table->string('foot_left')->nullable();
            $table->string('foot_right')->nullable();
            $table->string('foot_color', 20)->default('emerald');
            $table->string('image_url', 1000)->nullable();
            $table->string('image_alt')->nullable();
            $table->json('en')->nullable();
            $table->longText('detail')->nullable();
            $table->json('gallery')->nullable();
            $table->timestamps();
        });

        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('title');
            $table->date('event_date')->nullable();
            $table->longText('description')->nullable();
            $table->string('image_url', 1000)->nullable();
            $table->json('photos')->nullable();
            $table->json('en')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['gallery_items', 'portfolio_items', 'job_openings', 'reviews', 'career_applications', 'quote_requests', 'contact_messages', 'page_views', 'site_contents'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
