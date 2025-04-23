<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Laravel\Passport\Client;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Client::create([
            'id' => '9ebd8f82-e3fe-4205-87ad-bfe10e03cdd9',
            'name' => 'next.oauth-project.test',
            'secret' => null,
            'redirect' => 'http://next.oauth-project.test:3000/oauth/callback',
            'personal_access_client' => false,
            'password_client' => false,
            'revoked' => false,
        ]);

        Client::create([
            'id' => '8a979794-ff5f-4b84-8846-47b1c964b4d6',
            'name' => 'main-bvxea6i-rbdomchcjle6y.ca-1.platformsh.site',
            'secret' => null,
            'redirect' => 'https://main-bvxea6i-rbdomchcjle6y.ca-1.platformsh.site/oauth/callback',
            'personal_access_client' => false,
            'password_client' => false,
            'revoked' => false,
        ]);
    }
}
