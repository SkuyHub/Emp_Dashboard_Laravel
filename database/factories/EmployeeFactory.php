<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' =>  fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'position' => fake()->randomElement([
                'Manager', 'Developer', 'Designer', 'QA', 'HR']),
            'department' => fake()->randomElement([
                'IT', 'HR', 'Finance', 'Marketing']),
                'salary' => fake()->numberBetween(30000, 100000),
                'hired_at' => fake()->dateTimeBetween('-5 years', 'now'),
                'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }
}
