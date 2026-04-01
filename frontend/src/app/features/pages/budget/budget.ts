import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { BudgetService, Budget as BudgetModel } from '../../../core/services/budget-service';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';
import { BudgetFormComponent } from './components/budget-form/budget-form';
import { BudgetTableComponent } from './components/budget-table/budget-table';
import { DeleteModal } from '../../../shared/components/delete-modal/delete-modal';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [SharedModule, BudgetFormComponent, BudgetTableComponent, DeleteModal],
  templateUrl: './budget.html',
  styleUrl: './budget.css',
})
export class Budget {
  private budgetService = inject(BudgetService);
  private cdr = inject(ChangeDetectorRef);

  budgets: BudgetModel[] | null = null;
  isRefreshing = false;
  isFormModalOpen = false;
  isDeleteModalOpen = false;
  formMode: 'create' | 'edit' = 'create';
  selectedBudget: BudgetModel | null = null;
  deletingBudget: BudgetModel | null = null;

  ngOnInit() {
    this.loadBudgets(true);
  }

  loadBudgets(initialLoad = false) {
    if (!initialLoad) {
      this.isRefreshing = true;
    }

    this.budgetService.getBudgets().subscribe({
      next: (res) => {
        this.budgets = res.budgets ?? [];
        this.finishLoading();
        this.cdr.detectChanges();
      },
      error: () => {
        if (this.budgets === null) {
          this.budgets = [];
        }
        this.finishLoading();
        this.cdr.detectChanges();
        toast.error('Unable to load budgets');
      },
    });
  }

  openCreateModal() {
    const currentDate = new Date();

    this.formMode = 'create';
    this.selectedBudget = {
      limit: 0,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      period: 'monthly',
      alertFrequency: 'weekly',
    };
    this.isFormModalOpen = true;
  }

  openEditModal(budget: BudgetModel) {
    this.formMode = 'edit';
    this.selectedBudget = { ...budget };
    this.isFormModalOpen = true;
  }

  closeFormModal() {
    this.isFormModalOpen = false;
    this.selectedBudget = null;
  }

  saveBudget(budget: BudgetModel) {
    const request$ =
      this.formMode === 'edit' && budget._id
        ? this.budgetService.updateBudget(budget)
        : this.budgetService.createBudget(budget);

    request$.subscribe({
      next: (res) => {
        toast.success(res.message ?? 'Budget saved successfully');
        this.closeFormModal();
        this.loadBudgets();
      },
      error: (error: HttpErrorResponse) => {
        toast.error(error.error?.message ?? 'Unable to save budget');
      },
    });
  }

  openDeleteModal(budget: BudgetModel) {
    this.deletingBudget = budget;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.deletingBudget = null;
  }

  deleteBudget() {
    if (!this.deletingBudget?._id) {
      return;
    }

    this.budgetService.deleteBudget(this.deletingBudget._id).subscribe({
      next: (res) => {
        toast.success(res.message ?? 'Budget deleted successfully');
        this.closeDeleteModal();
        this.loadBudgets();
      },
      error: (error: HttpErrorResponse) => {
        toast.error(error.error?.message ?? 'Unable to delete budget');
      },
    });
  }

  private finishLoading() {
    this.isRefreshing = false;
  }
}
