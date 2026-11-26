<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    private function adminToken(): string
    {
        User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'rahasia123']);

        return $this->postJson('/api/admin/login', ['email' => 'admin@example.com', 'password' => 'rahasia123'])
            ->assertOk()
            ->json('token');
    }

    public function test_public_endpoints_respond(): void
    {
        $this->getJson('/api/site-content')->assertOk()->assertJson([]);
        $this->getJson('/api/jobs')->assertOk()->assertJsonStructure(['managed', 'jobs']);
        $this->getJson('/api/portfolio')->assertOk()->assertJsonStructure(['managed', 'filters', 'items']);
        $this->getJson('/api/gallery')->assertOk();
    }

    public function test_contact_form_is_validated_and_stored(): void
    {
        $this->postJson('/api/contact-messages', [])->assertStatus(422);

        $this->postJson('/api/contact-messages', [
            'full_name' => 'Budi', 'email' => 'budi@example.com', 'message' => 'Halo',
        ])->assertCreated();

        $this->assertDatabaseHas('contact_messages', ['email' => 'budi@example.com']);
    }

    public function test_quote_request_is_stored(): void
    {
        $this->postJson('/api/quote-requests', [
            'full_name' => 'Sari', 'email' => 'sari@example.com', 'phone' => '0812',
            'selected_items' => ['Oksigen Medis 6m3 x 10'],
        ])->assertCreated();

        $this->assertDatabaseHas('quote_requests', ['email' => 'sari@example.com']);
    }

    public function test_admin_routes_require_login(): void
    {
        $this->getJson('/api/admin/me')->assertUnauthorized();
        $this->getJson('/api/admin/stats')->assertUnauthorized();
    }

    public function test_wrong_password_is_rejected(): void
    {
        User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'rahasia123']);

        $this->postJson('/api/admin/login', ['email' => 'admin@example.com', 'password' => 'salah'])->assertStatus(422);
    }

    public function test_admin_can_manage_jobs_and_they_appear_publicly(): void
    {
        $auth = ['Authorization' => 'Bearer '.$this->adminToken()];

        $this->getJson('/api/admin/me', $auth)->assertOk()->assertJson(['email' => 'admin@example.com']);

        $id = $this->postJson('/api/admin/items/jobs', ['title' => 'Operator Filling', 'is_active' => true], $auth)
            ->assertSuccessful()
            ->json('id');

        $this->getJson('/api/jobs')->assertOk()->assertJsonFragment(['title' => 'Operator Filling']);

        $this->deleteJson("/api/admin/items/jobs/{$id}", [], $auth)->assertSuccessful();
        $this->getJson('/api/jobs')->assertOk()->assertJsonMissing(['title' => 'Operator Filling']);
    }

    public function test_admin_inbox_lists_messages(): void
    {
        $this->postJson('/api/contact-messages', [
            'full_name' => 'Budi', 'email' => 'budi@example.com', 'message' => 'Halo',
        ])->assertCreated();

        $auth = ['Authorization' => 'Bearer '.$this->adminToken()];
        $this->getJson('/api/admin/inbox/unread', $auth)->assertOk();
        $this->getJson('/api/admin/inbox/contact_messages', $auth)->assertOk()->assertJsonFragment(['email' => 'budi@example.com']);
        $this->getJson('/api/admin/stats?since=2020-01-01', $auth)->assertOk();
    }
}
