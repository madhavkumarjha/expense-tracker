import { Component,ChangeDetectorRef,inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ExpenseForm } from './components/expense-form/expense-form';
import {ExpenseTable} from "./components/expense-table/expense-table"
import { ExpenseService } from '../../../core/services/expense-service';
import { Expense as ExpenseModel } from '../../../core/models/expense.model';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteModal } from '../../../shared/components/delete-modal/delete-modal';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [SharedModule, ExpenseForm,ExpenseTable,DeleteModal],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  expenses: ExpenseModel[] | null = null;
  isRefreshing = false;
  isFormModalOpen = false;
  isDeleteModalOpen = false;
  formMode: 'create' | 'edit' = 'create';
  selectedExpense: ExpenseModel | null = null;
  deletingExpense: ExpenseModel | null = null;

  ngOnInit() {
    this.loadExpenses(true);
  }

  loadExpenses(initialLoad = false) {
    if (!initialLoad) {
      this.isRefreshing = true;
    }

    this.expenseService.getExpenses().subscribe({
      next: (res) => {
        this.expenses = res.expenses ?? [];
        this.finishLoading();
        this.cdr.detectChanges();
      },
      error: () => {
        if (this.expenses === null) {
          this.expenses = [];
        }
        this.finishLoading();
        this.cdr.detectChanges();
        toast.error('Unable to load expenses');
      },
    });
  }

  openCreateModal() {
    this.formMode = 'create';
    this.selectedExpense = {
      title: '',
      amount: 0,
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    };
    this.isFormModalOpen = true;
  }

  openEditModal(expense: ExpenseModel) {
    this.formMode = 'edit';
    this.selectedExpense = { ...expense };
    this.isFormModalOpen = true;
  }

   closeFormModal() {
    this.isFormModalOpen = false;
    this.selectedExpense = null;
  }

   saveExpense(expense: ExpenseModel) {
    const request$ =
      this.formMode === 'edit' && expense._id
        ? this.expenseService.updateExpense(expense)
        : this.expenseService.createExpense(expense);

    request$.subscribe({
      next: (res) => {
        toast.success(res.message ?? 'Expense saved successfully');
        this.closeFormModal();
        this.loadExpenses();
      },
      error: (error: HttpErrorResponse) => {
        toast.error(error.error?.message ?? 'Unable to save expense');
      },
    });
  }

   openDeleteModal(expense: ExpenseModel) {
    this.deletingExpense = expense;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.deletingExpense = null;
  }

  deleteExpense() {
    if (!this.deletingExpense?._id) {
      return;
    }

    this.expenseService.deleteExpense(this.deletingExpense._id).subscribe({
      next: (res) => {
        toast.success(res.message ?? 'Expense deleted successfully');
        this.closeDeleteModal();
        this.loadExpenses();
      },
      error: (error: HttpErrorResponse) => {
        toast.error(error.error?.message ?? 'Unable to delete expense');
      },
    });
  }

  private finishLoading() {
    this.isRefreshing = false;
  }

}
