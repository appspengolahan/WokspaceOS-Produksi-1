/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SidebarRail } from './components/Navigation/SidebarRail';
import { TopNavbar } from './components/Navigation/TopNavbar';
import { MobileNav } from './components/Navigation/MobileNav';
import { SingleBoardView } from './components/SingleBoard/SingleBoardView';
import { StockMonitoringView } from './components/Modules/StockMonitoringView';
import { ProcessDataView } from './components/Modules/ProcessDataView';
import { LetterArchiveView } from './components/Modules/LetterArchiveView';
import { HRSystemView } from './components/Modules/HRSystemView';
import { PurchaseRequestView } from './components/Modules/PurchaseRequestView';
import { CRMClientsView } from './components/Modules/CRMClientsView';
import { GeneralMonitoringView } from './components/Modules/GeneralMonitoringView';
import { GoogleSheetsSyncModal } from './components/Modules/GoogleSheetsSyncModal';
import { AccessManagementModal } from './components/Navigation/AccessManagementModal';

import { useTheme } from './hooks/useTheme';
import { 
  INITIAL_USER_PROFILES, 
  INITIAL_APPS_REGISTRY, 
  INITIAL_STOCK_ITEMS, 
  INITIAL_STOCK_MUTATIONS, 
  INITIAL_PROCESS_RECORDS, 
  INITIAL_LETTERS, 
  INITIAL_EMPLOYEES, 
  INITIAL_PURCHASE_REQUESTS, 
  INITIAL_CRM_CLIENTS, 
  INITIAL_GAS_CONFIGS 
} from './data/mockData';
import { 
  AppRegistryItem, 
  StockItem, 
  StockMutation, 
  ProcessBatchRecord, 
  LetterRecord, 
  EmployeeRecord, 
  PurchaseRequestRecord, 
  CRMClientRecord, 
  GasSheetConnectionConfig, 
  UserProfile 
} from './types';
import { ChevronRight, CheckCircle2, Home } from 'lucide-react';

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  // Navigation and Layout state
  const [currentModule, setCurrentModule] = useState<string>('single_board');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true); // Mini Rail mode default for modern compact feel
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState<boolean>(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);

  // User and RBAC state
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(INITIAL_USER_PROFILES);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_PROFILES[0]);

  // Operational Data state
  const [apps, setApps] = useState<AppRegistryItem[]>(INITIAL_APPS_REGISTRY);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [mutations, setMutations] = useState<StockMutation[]>(INITIAL_STOCK_MUTATIONS);
  const [processRecords, setProcessRecords] = useState<ProcessBatchRecord[]>(INITIAL_PROCESS_RECORDS);
  const [letters, setLetters] = useState<LetterRecord[]>(INITIAL_LETTERS);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(INITIAL_EMPLOYEES);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequestRecord[]>(INITIAL_PURCHASE_REQUESTS);
  const [crmClients, setCrmClients] = useState<CRMClientRecord[]>(INITIAL_CRM_CLIENTS);
  const [gasConfigs, setGasConfigs] = useState<GasSheetConnectionConfig[]>(INITIAL_GAS_CONFIGS);

  // Sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Critical stock alert count
  const stockAlertCount = stockItems.filter(s => s.status === 'Kritis' || s.status === 'Menipis').length;

  // Dynamic Vercel URLs derived from apps registry or custom configuration
  const stockVercelUrl = apps.find(a => a.moduleId === 'stock_monitoring')?.externalUrl || 'https://monitoring-stock-pp-1-pro-api.vercel.app/';
  const tembakauVercelUrl = apps.find(a => a.moduleId === 'process_tembakau')?.externalUrl;
  const hrVercelUrl = apps.find(a => a.moduleId === 'hr_karyawan')?.externalUrl;

  // Handlers
  const handleSelectModule = (moduleId: string) => {
    setCurrentModule(moduleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApp = (app: AppRegistryItem) => {
    if (app.moduleId) {
      setCurrentModule(app.moduleId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddNewApp = (newApp: Partial<AppRegistryItem>) => {
    const fullApp: AppRegistryItem = {
      id: `app_${Date.now()}`,
      moduleId: newApp.moduleId || 'single_board',
      name: newApp.name || 'APLIKASI BARU PP1',
      description: newApp.description || 'Modul operasional Divisi Produksi 1',
      category: newApp.category || 'Persediaan & Stok',
      visibility: newApp.visibility || 'Internal Divisi',
      status: 'Aktif',
      pic: newApp.pic || 'Manajer Operasional / Lalu M.',
      icon: newApp.category === 'HR & Ketenagakerjaan' ? 'Users' : newApp.category === 'Data Proses Produksi' ? 'Leaf' : 'LayoutGrid',
      externalUrl: newApp.externalUrl,
      lastSync: newApp.lastSync || 'Baru saja'
    };
    setApps(prev => [fullApp, ...prev]);
    showToast(`Web app ${fullApp.name} berhasil ditambahkan ke Single Board!`);
  };

  const handleUpdateApp = (updatedApp: AppRegistryItem) => {
    setApps(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
    showToast(`Web app ${updatedApp.name} berhasil diperbarui!`);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUserProfiles(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    showToast(`Akses pengguna ${updatedUser.name} (${updatedUser.email}) berhasil diperbarui!`);
  };

  const handleAddUser = (newUser: Omit<UserProfile, 'id'>) => {
    const user: UserProfile = {
      id: `user_${Date.now()}`,
      ...newUser
    };
    setUserProfiles(prev => [...prev, user]);
    showToast(`Pengguna baru ${user.name} (${user.email}) berhasil didaftarkan!`);
  };

  const handleDeleteUser = (userId: string) => {
    setUserProfiles(prev => prev.filter(u => u.id !== userId));
    showToast('Pengguna berhasil dihapus.');
  };

  const handleAddMutation = (newMut: Omit<StockMutation, 'id' | 'date'>) => {
    const id = `mut_${Date.now()}`;
    const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const mutation: StockMutation = { id, date, ...newMut };

    // Update stock quantity accordingly
    setStockItems(prev => prev.map(item => {
      if (item.id === newMut.stockItemId) {
        let updatedQty = item.currentStockKg;
        if (newMut.type === 'MASUK') {
          updatedQty += newMut.quantityKg;
        } else if (newMut.type === 'KELUAR') {
          updatedQty = Math.max(0, updatedQty - newMut.quantityKg);
        }
        
        const newStatus = updatedQty <= item.minStockThresholdKg * 0.7 
          ? 'Kritis' 
          : updatedQty <= item.minStockThresholdKg 
          ? 'Menipis' 
          : 'Aman';

        return {
          ...item,
          currentStockKg: updatedQty,
          status: newStatus,
          lastUpdated: 'Baru saja'
        };
      }
      return item;
    }));

    setMutations(prev => [mutation, ...prev]);
    showToast(`Mutasi stok ${newMut.materialName} (${newMut.quantityKg} KG) berhasil dicatat!`);
  };

  const handleUpdateStock = (updatedItem: StockItem) => {
    setStockItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    showToast(`Data stok ${updatedItem.name} diperbarui!`);
  };

  const handleAddProcessRecord = (newRecord: Omit<ProcessBatchRecord, 'id'>) => {
    const record: ProcessBatchRecord = {
      id: `prc_${Date.now()}`,
      ...newRecord
    };
    setProcessRecords(prev => [record, ...prev]);
    showToast(`Batch ${record.batchCode} (${record.processType}) tersimpan ke spreadsheet!`);
  };

  const handleAddLetter = (newLetter: Omit<LetterRecord, 'id'>) => {
    const letter: LetterRecord = {
      id: `let_${Date.now()}`,
      ...newLetter
    };
    setLetters(prev => [letter, ...prev]);
    showToast(`Surat resmi no ${letter.letterNumber} telah didaftarkan!`);
  };

  const handleAddEmployee = (newEmployee: Omit<EmployeeRecord, 'id'>) => {
    const employee: EmployeeRecord = {
      id: `emp_${Date.now()}`,
      ...newEmployee
    };
    setEmployees(prev => [employee, ...prev]);
    showToast(`Tenaga kerja ${employee.fullName} (${employee.nip}) terdaftar!`);
  };

  const handleAddPurchaseRequest = (newReq: Omit<PurchaseRequestRecord, 'id'>) => {
    const request: PurchaseRequestRecord = {
      id: `spp_${Date.now()}`,
      ...newReq
    };
    setPurchaseRequests(prev => [request, ...prev]);
    showToast(`SPP No. ${request.sppNumber} berhasil diajukan!`);
  };

  const handleApprovePurchaseRequest = (id: string, approverName: string) => {
    setPurchaseRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: 'Disetujui Manajer',
          approvedBy: approverName
        };
      }
      return req;
    }));
    showToast(`SPP telah disetujui oleh ${approverName}!`);
  };

  const handleAddClient = (newClient: Omit<CRMClientRecord, 'id'>) => {
    const client: CRMClientRecord = {
      id: `crm_${Date.now()}`,
      ...newClient
    };
    setCrmClients(prev => [client, ...prev]);
    showToast(`Mitra ${client.companyName} ditambahkan ke CRM Hub!`);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSyncing(false);
    showToast('Sinkronisasi Google Spreadsheet GAS V2 berhasil (Seluruh sheet up to date)');
  };

  const handleTriggerModuleSync = async (moduleId: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    showToast(`Sinkronisasi endpoint ${moduleId} sukses!`);
    return true;
  };

  const showToast = (message: string) => {
    setSyncToastMessage(message);
    setTimeout(() => {
      setSyncToastMessage(null);
    }, 3500);
  };

  // Breadcrumbs text helper
  const getBreadcrumbTitle = () => {
    switch (currentModule) {
      case 'single_board': return 'Pusat Navigasi Single Board';
      case 'stock_monitoring': return 'Monitoring Stock Bahan Baku';
      case 'stock_mutation': return 'Mutasi & Arus Persediaan';
      case 'general_monitoring': return 'General Monitoring Pabrik';
      case 'process_cengkeh': return 'Rekap Data Proses Cengkeh';
      case 'process_tembakau': return 'Rekap Data Proses Tembakau';
      case 'process_krosok': return 'Rekap Data Proses Krosok';
      case 'process_blend': return 'Rekap Data Proses Blend';
      case 'log_surat': return 'Log Surat & Pengarsipan';
      case 'hr_karyawan': return 'HR & Database Tenaga Kerja';
      case 'hr_presensi': return 'Presensi GPS Lokasi Pabrik';
      case 'hr_kpi': return 'Matriks Pengukuran KPI';
      case 'purchase_spp': return 'Surat Permintaan Pembelian (SPP)';
      case 'crm_clients': return 'CRM Clients & Mitra Industri';
      default: return 'Portal Divisi Produksi 1';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <TopNavbar
        onToggleMobileMenu={() => setIsMobileDrawerOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        availableUsers={userProfiles}
        onSelectUser={setCurrentUser}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        onOpenAccessModal={() => setIsAccessModalOpen(true)}
        isSyncing={isSyncing}
        onManualSync={handleManualSync}
      />

      {/* Main Body with Sidebar Rail + Main Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Mini Rail Mode or Expanded) */}
        <SidebarRail
          currentModule={currentModule}
          onSelectModule={handleSelectModule}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userRole={currentUser.role}
          stockAlertCount={stockAlertCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 lg:p-6 pb-20 md:pb-8">
          {/* Breadcrumb Navigation Trail */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
            <button
              onClick={() => handleSelectModule('single_board')}
              className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal PP1</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">
              {getBreadcrumbTitle()}
            </span>
          </div>

          {/* Module Router View */}
          {currentModule === 'single_board' && (
            <SingleBoardView
              apps={apps}
              onOpenApp={handleOpenApp}
              userRole={currentUser.role}
              onOpenGasModal={() => setIsGasModalOpen(true)}
              onAddNewApp={handleAddNewApp}
              onUpdateApp={handleUpdateApp}
            />
          )}

          {(currentModule === 'stock_monitoring' || currentModule === 'stock_mutation') && (
            <StockMonitoringView
              stockItems={stockItems}
              mutations={mutations}
              onAddMutation={handleAddMutation}
              onUpdateStock={handleUpdateStock}
              userRole={currentUser.role}
              onOpenGasModal={() => setIsGasModalOpen(true)}
              vercelUrl={stockVercelUrl}
            />
          )}

          {currentModule === 'general_monitoring' && (
            <GeneralMonitoringView
              onNavigateToModule={handleSelectModule}
            />
          )}

          {(currentModule === 'process_cengkeh' ||
            currentModule === 'process_tembakau' ||
            currentModule === 'process_krosok' ||
            currentModule === 'process_blend') && (
            <ProcessDataView
              initialProcessType={
                currentModule === 'process_cengkeh'
                  ? 'Cengkeh'
                  : currentModule === 'process_krosok'
                  ? 'Krosok'
                  : currentModule === 'process_blend'
                  ? 'Blend'
                  : 'Tembakau'
              }
              processRecords={processRecords}
              onAddProcessRecord={handleAddProcessRecord}
              userRole={currentUser.role}
              onOpenGasModal={() => setIsGasModalOpen(true)}
              tembakauVercelUrl={tembakauVercelUrl}
            />
          )}

          {currentModule === 'log_surat' && (
            <LetterArchiveView
              letters={letters}
              onAddLetter={handleAddLetter}
              userRole={currentUser.role}
              onOpenGasModal={() => setIsGasModalOpen(true)}
            />
          )}

          {(currentModule === 'hr_karyawan' ||
            currentModule === 'hr_presensi' ||
            currentModule === 'hr_kpi' ||
            currentModule === 'hr_recruitment') && (
            <HRSystemView
              initialSubTab={
                currentModule === 'hr_presensi'
                  ? 'presensi'
                  : currentModule === 'hr_kpi'
                  ? 'kpi'
                  : currentModule === 'hr_recruitment'
                  ? 'rekrutmen'
                  : 'karyawan'
              }
              employees={employees}
              onAddEmployee={handleAddEmployee}
              userRole={currentUser.role}
              hrVercelUrl={hrVercelUrl}
            />
          )}

          {currentModule === 'purchase_spp' && (
            <PurchaseRequestView
              requests={purchaseRequests}
              onAddRequest={handleAddPurchaseRequest}
              onApproveRequest={handleApprovePurchaseRequest}
              userRole={currentUser.role}
              currentUserName={currentUser.name}
            />
          )}

          {currentModule === 'crm_clients' && (
            <CRMClientsView
              clients={crmClients}
              onAddClient={handleAddClient}
              userRole={currentUser.role}
            />
          )}
        </main>
      </div>

      {/* Mobile Ergonomic Bottom Bar & Drawer */}
      <MobileNav
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        isOpenDrawer={isMobileDrawerOpen}
        onCloseDrawer={() => setIsMobileDrawerOpen(false)}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        userRole={currentUser.role}
        stockAlertCount={stockAlertCount}
      />

      {/* Google Sheets GAS V2 Modular Sync Modal */}
      <GoogleSheetsSyncModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        gasConfigs={gasConfigs}
        onUpdateConfig={(updated) => {
          setGasConfigs(prev => prev.map(c => c.moduleId === updated.moduleId ? updated : c));
        }}
        onTriggerSync={handleTriggerModuleSync}
      />

      {/* User Access & Email Management Modal (Developer & PM Authority) */}
      <AccessManagementModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        users={userProfiles}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* Real-time Notification Toast */}
      {syncToastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{syncToastMessage}</span>
        </div>
      )}
    </div>
  );
}
