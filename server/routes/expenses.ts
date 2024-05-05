import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

type Expense = z.infer<typeof expenseSchema>;

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Rent", amount: 1000 },
  { id: 2, title: "Groceries", amount: 50 },
  { id: 3, title: "Movie Tickets", amount: 20 },
];

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    c.status(201);
    return c.json(expense);
  })
  .get("/total-spent", (c) => {
    const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    return c.json({ total });
  })
  // making sure the path param is a number with Regexp {[0-9]+}, if not => 404
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const expense = fakeExpenses.find((fakeExpense) => fakeExpense.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const expenseId = parseInt(c.req.param("id")); // Extract ID from URL path

    // Find the index of the expense to remove (if needed)
    const indexToRemove = fakeExpenses.findIndex((expense) => expense.id === expenseId);

    if (indexToRemove !== -1) {
      // Simulate deletion by splicing (not recommended for production)
      fakeExpenses.splice(indexToRemove, 1);
      // Respond with success or error (assuming successful deletion)
      return c.json({ message: "Expense deleted successfully" }, 200);
    } else {
      return c.json({ error: "Expense not found" }, 404);
    }
  });
