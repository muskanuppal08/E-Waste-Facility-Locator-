<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $connection = \Illuminate\Support\Facades\DB::connection();
        if ($connection instanceof \Illuminate\Database\SQLiteConnection) {
            $pdo = $connection->getPdo();
            $pdo->sqliteCreateFunction('acos', 'acos', 1);
            $pdo->sqliteCreateFunction('cos', 'cos', 1);
            $pdo->sqliteCreateFunction('sin', 'sin', 1);
            $pdo->sqliteCreateFunction('radians', 'deg2rad', 1);
            $pdo->sqliteCreateFunction('LEAST', function(...$args) {
                return min($args);
            });
            $pdo->sqliteCreateFunction('GREATEST', function(...$args) {
                return max($args);
            });
        }
    }
}
