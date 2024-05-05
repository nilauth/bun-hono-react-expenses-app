import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
const App = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const fetchTotalAmount = async () => {
    try {
      const res = await fetch("/api/expenses/total-spent");
      const data = await res.json();
      setTotalExpenses(data.total);
    } catch (error) {
      console.error("Error fetching total expenses:", error);
      // Handle the error gracefully (e.g., display an error message)
    }
  };

  useEffect(() => {
    fetchTotalAmount();
  }, []);
  return (
    <div className='h-screen flex justify-center items-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>
            <h1 className='text-4xl'>Total spent</h1>
          </CardTitle>
          <CardDescription>
            <p className='text-lg'>The total amount you-ve spent</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h1 className='text-3xl'>{totalExpenses} MAD</h1>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
