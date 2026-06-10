<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Resources\EmployeeResource;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::orderBy('created_at', 'desc')->paginate(10);
        return EmployeeResource::collection($employees);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:employees,email',
            'phone' => 'nullable|string|max:20',
            'position' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'salary' => 'required|numeric|min:0',
            'hired_at' => 'required|date',
            'status' => 'required|in:active,inactive',
        ]);

        $employee = Employee::create($validated);
        return new EmployeeResource($employee);
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        return new EmployeeResource($employee);
    }
    

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:employees,email,' . $employee->id,
            'phone' => 'nullable|string|max:20',
            'position' => 'sometimes|required|string|max:100',
            'department' => 'sometimes|required|string|max:100',
            'salary' => 'sometimes|required|numeric|min:0',
            'hired_at' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        $employee->update($validated);
        return new EmployeeResource($employee);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully']);
    }
}
