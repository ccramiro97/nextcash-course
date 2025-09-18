"use client";

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectValue } from '@radix-ui/react-select';
import { addDays, format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { Input } from './ui/input';
import { type Category } from '@/types/Category';

export const transactionFormSchema = z.object({
  transactionType: z.enum(["income", "expense"]),
  categoryId: z.coerce.number<number>().positive("Please select a category"),
  transactionDate: z.coerce.date<Date>().max(addDays(new Date, 1), "Transaction date cannot be in the future"),
  amount: z.coerce.number<number>().positive("Amount must be greater than 0"),
  description: z.string().min(3, "Description must contain at least 3 characters").max(300, "Description must contain a maximum of 300 characters")
});

type Prop = {
  categories: Category[];
  onSubmit: (data: z.infer<typeof transactionFormSchema>) => Promise<void>;
  defaultValues?: {
    amount: number;
    categoryId: number;
    description: string;
    transactionDate: Date
    transactionType: "income" | "expense";
  }
};

export default function TransactionForm({
  categories,
  defaultValues,
  onSubmit,
}: Prop) {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: 0,
      categoryId: 0,
      description: "",
      transactionDate: new Date(),
      transactionType: "income",
      ...defaultValues
    }
  });

  const transactionType = form.watch("transactionType");
  const filteredCategories = categories.filter(category => category.type === transactionType);

  return <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <fieldset disabled={form.formState.isSubmitting} className="grid grid-cols-2 gap-y-5 gap-x-2 items-start">
        <FormField control={form.control} name="transactionType" render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <Select onValueChange={(newValue) => {
                  field.onChange(newValue);
                  form.setValue("categoryId", 0);
                }} value={field.value}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          );
        }} />
        <FormField control={form.control} name="categoryId" render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value.toString()}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map(category => (<SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          );
        }} />
        <FormField control={form.control} name="transactionDate" render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Transaction Date</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      captionLayout="dropdown"
                      onSelect={field.onChange}
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          );
        }} />
        <FormField control={form.control} name="amount" render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} type='number' />
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          );
        }} />
      </fieldset>
      <fieldset disabled={form.formState.isSubmitting} className='mt-5 flex flex-col gap-5'>
        <FormField control={form.control} name="description" render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          );
        }} />
        <Button type='submit'>Submit</Button>
      </fieldset>
    </form>
  </Form>
}