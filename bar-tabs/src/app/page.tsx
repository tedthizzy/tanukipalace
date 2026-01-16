'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useTabStore } from '@/store/tabStore';
import { tanukis, getTanukiById, drunkLevelEmoji, drunkLevelLabels, DrunkLevel } from '@/data/tanukis';
import { sakeMenu, getSakeById } from '@/data/sake';
import { formatCurrency, formatTime, cn } from '@/lib/utils';
import { Plus, X, Trash2, Receipt, Users, Wine, BarChart3 } from 'lucide-react';

export default function BarTabsPage() {
  const [selectedTanuki, setSelectedTanuki] = useState<string>('');
  const [selectedSake, setSelectedSake] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    addOrder,
    removeOrder,
    setDiscount,
    setTip,
    setActiveTab,
    getTabSubtotal,
    getTabTotal,
    getDrunkPoints,
    getTanukiDrunkLevel,
    clearClosedTabs,
  } = useTabStore();

  const openTabs = tabs.filter((t) => t.isOpen);
  const closedTabs = tabs.filter((t) => !t.isOpen);
  const activeTab = tabs.find((t) => t.tanukiId === activeTabId && t.isOpen);

  const handleOpenTab = () => {
    if (selectedTanuki) {
      openTab(selectedTanuki);
      setSelectedTanuki('');
    }
  };

  const handleAddOrder = () => {
    if (activeTabId && selectedSake && quantity > 0) {
      addOrder(activeTabId, selectedSake, quantity);
      setQuantity(1);
    }
  };

  const getDrunkLevelBadgeClass = (level: DrunkLevel) => {
    return `badge badge-${level.replace('-', '-')}`;
  };

  // Calculate totals across all open tabs
  const totalRevenue = openTabs.reduce((sum, tab) => sum + getTabTotal(tab.tanukiId), 0);
  const totalOrders = openTabs.reduce((sum, tab) => sum + tab.orders.length, 0);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--palace-gold)] mb-2">
          🦝 狸御殿 Bar Tabs
        </h1>
        <p className="text-[var(--tanuki-cream)] opacity-70">
          Tanuki Palace Point of Sale System
        </p>
      </header>

      <Tabs.Root defaultValue="tabs" className="w-full">
        <Tabs.List className="flex border-b border-[rgba(212,168,83,0.3)] mb-6">
          <Tabs.Trigger value="tabs" className="tab-trigger flex items-center gap-2">
            <Receipt size={18} />
            Open Tabs
          </Tabs.Trigger>
          <Tabs.Trigger value="customers" className="tab-trigger flex items-center gap-2">
            <Users size={18} />
            Customers
          </Tabs.Trigger>
          <Tabs.Trigger value="menu" className="tab-trigger flex items-center gap-2">
            <Wine size={18} />
            Sake Menu
          </Tabs.Trigger>
          <Tabs.Trigger value="summary" className="tab-trigger flex items-center gap-2">
            <BarChart3 size={18} />
            Summary
          </Tabs.Trigger>
        </Tabs.List>

        {/* ========== OPEN TABS TAB ========== */}
        <Tabs.Content value="tabs" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Open Tab List */}
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[var(--palace-gold)]">Open Tabs</h2>
                <span className="badge badge-sober">{openTabs.length} active</span>
              </div>

              {/* New Tab Form */}
              <div className="flex gap-2 mb-4">
                <select
                  className="select flex-1"
                  value={selectedTanuki}
                  onChange={(e) => setSelectedTanuki(e.target.value)}
                >
                  <option value="">Select customer...</option>
                  {tanukis
                    .filter((t) => !openTabs.some((tab) => tab.tanukiId === t.id))
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.avatar} {t.name} ({t.nameJp})
                      </option>
                    ))}
                </select>
                <button className="btn btn-primary flex items-center gap-1" onClick={handleOpenTab}>
                  <Plus size={18} />
                </button>
              </div>

              {/* Tab List */}
              <div className="space-y-2">
                {openTabs.map((tab) => {
                  const tanuki = getTanukiById(tab.tanukiId);
                  const drunkLevel = getTanukiDrunkLevel(tab.tanukiId);
                  if (!tanuki) return null;

                  return (
                    <div
                      key={tab.tanukiId}
                      className={cn(
                        'p-3 rounded-lg cursor-pointer transition-all border',
                        activeTabId === tab.tanukiId
                          ? 'bg-[rgba(212,168,83,0.2)] border-[var(--palace-gold)]'
                          : 'bg-[rgba(10,10,26,0.4)] border-transparent hover:border-[rgba(212,168,83,0.3)]'
                      )}
                      onClick={() => setActiveTab(tab.tanukiId)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={drunkLevel !== 'sober' ? 'drunk-wobble' : ''}>
                              {tanuki.avatar}
                            </span>
                            <span className="font-medium">{tanuki.name}</span>
                          </div>
                          <div className="text-sm opacity-60 mt-1">
                            {tab.orders.length} items · {formatCurrency(getTabTotal(tab.tanukiId))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={getDrunkLevelBadgeClass(drunkLevel)}>
                            {drunkLevelEmoji[drunkLevel]} {drunkLevelLabels[drunkLevel]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {openTabs.length === 0 && (
                  <p className="text-center opacity-50 py-8">No open tabs</p>
                )}
              </div>
            </div>

            {/* Middle: Active Tab Details */}
            <div className="card lg:col-span-2">
              {activeTab ? (
                <>
                  <div className="card-header flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--palace-gold)]">
                        {getTanukiById(activeTab.tanukiId)?.name}&apos;s Tab
                      </h2>
                      <p className="text-sm opacity-60">
                        Opened at {formatTime(activeTab.openedAt)}
                      </p>
                    </div>
                    <button
                      className="btn btn-danger flex items-center gap-1"
                      onClick={() => closeTab(activeTab.tanukiId)}
                    >
                      <X size={16} /> Close Tab
                    </button>
                  </div>

                  {/* Add Order Form */}
                  <div className="flex gap-2 mb-4">
                    <select
                      className="select flex-1"
                      value={selectedSake}
                      onChange={(e) => setSelectedSake(e.target.value)}
                    >
                      <option value="">Select sake...</option>
                      {sakeMenu.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.nameJp}) - {formatCurrency(s.price)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="input w-20"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleAddOrder}
                      disabled={!selectedSake}
                    >
                      Add
                    </button>
                  </div>

                  {/* Orders Table */}
                  <div className="overflow-x-auto mb-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Drunk Pts</th>
                          <th>Time</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeTab.orders.map((order, idx) => {
                          const sake = getSakeById(order.sakeId);
                          if (!sake) return null;
                          return (
                            <tr key={idx}>
                              <td>
                                <div>
                                  <div className="font-medium">{sake.name}</div>
                                  <div className="text-sm opacity-60">{sake.nameJp}</div>
                                </div>
                              </td>
                              <td>{order.quantity}</td>
                              <td>{formatCurrency(sake.price * order.quantity)}</td>
                              <td className="text-[var(--lantern-glow)]">
                                +{sake.drunkPoints * order.quantity}
                              </td>
                              <td className="text-sm opacity-60">
                                {formatTime(order.timestamp)}
                              </td>
                              <td>
                                <button
                                  className="btn btn-ghost p-1"
                                  onClick={() => removeOrder(activeTab.tanukiId, idx)}
                                >
                                  <Trash2 size={16} className="text-[var(--danger)]" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {activeTab.orders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center opacity-50 py-8">
                              No orders yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Tab Summary */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-[rgba(10,10,26,0.4)] rounded-lg">
                    <div>
                      <label className="block text-sm opacity-60 mb-1">Discount %</label>
                      <input
                        type="number"
                        className="input"
                        min={0}
                        max={100}
                        value={activeTab.discount}
                        onChange={(e) =>
                          setDiscount(activeTab.tanukiId, parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm opacity-60 mb-1">Tip</label>
                      <input
                        type="number"
                        className="input"
                        min={0}
                        value={activeTab.tip}
                        onChange={(e) =>
                          setTip(activeTab.tanukiId, parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="mt-4 p-4 bg-[rgba(212,168,83,0.1)] rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="opacity-70">Subtotal</span>
                      <span>{formatCurrency(getTabSubtotal(activeTab.tanukiId))}</span>
                    </div>
                    {activeTab.discount > 0 && (
                      <div className="flex justify-between mb-2 text-[var(--success)]">
                        <span>Discount ({activeTab.discount}%)</span>
                        <span>
                          -{formatCurrency(getTabSubtotal(activeTab.tanukiId) * (activeTab.discount / 100))}
                        </span>
                      </div>
                    )}
                    {activeTab.tip > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="opacity-70">Tip</span>
                        <span>{formatCurrency(activeTab.tip)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-[var(--palace-gold)] pt-2 border-t border-[rgba(212,168,83,0.3)]">
                      <span>Total</span>
                      <span>{formatCurrency(getTabTotal(activeTab.tanukiId))}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="opacity-70">Drunk Points</span>
                      <span className="text-[var(--lantern-glow)]">
                        {getDrunkPoints(activeTab.tanukiId)} pts
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 opacity-50">
                  <Receipt size={48} className="mb-4" />
                  <p>Select a tab to view details</p>
                </div>
              )}
            </div>
          </div>
        </Tabs.Content>

        {/* ========== CUSTOMERS TAB ========== */}
        <Tabs.Content value="customers" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tanukis.map((tanuki) => {
              const hasOpenTab = openTabs.some((t) => t.tanukiId === tanuki.id);
              const drunkLevel = hasOpenTab ? getTanukiDrunkLevel(tanuki.id) : 'sober';
              const drunkPoints = hasOpenTab ? getDrunkPoints(tanuki.id) : 0;

              return (
                <div key={tanuki.id} className="card">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'text-4xl',
                        drunkLevel !== 'sober' && 'drunk-wobble'
                      )}
                    >
                      {tanuki.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--palace-gold)]">
                        {tanuki.name}
                      </h3>
                      <p className="text-sm opacity-60">{tanuki.nameJp}</p>
                      <p className="text-sm mt-2">{tanuki.personality}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={getDrunkLevelBadgeClass(drunkLevel)}>
                          {drunkLevelEmoji[drunkLevel]} {drunkLevelLabels[drunkLevel]}
                        </span>
                        {drunkPoints > 0 && (
                          <span className="text-sm text-[var(--lantern-glow)]">
                            {drunkPoints} pts
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm opacity-60">
                        Favorite: {getSakeById(tanuki.favoriteSake)?.name}
                      </div>
                    </div>
                    <div>
                      {hasOpenTab ? (
                        <span className="badge badge-tipsy">Tab Open</span>
                      ) : (
                        <button
                          className="btn btn-secondary text-sm"
                          onClick={() => openTab(tanuki.id)}
                        >
                          Open Tab
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs.Content>

        {/* ========== SAKE MENU TAB ========== */}
        <Tabs.Content value="menu" className="outline-none">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-[var(--palace-gold)]">🍶 Sake Menu</h2>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Drunk Pts</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {sakeMenu.map((sake) => (
                  <tr key={sake.id}>
                    <td>
                      <div>
                        <div className="font-medium">{sake.name}</div>
                        <div className="text-sm opacity-60">{sake.nameJp}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-merry capitalize">{sake.type}</span>
                    </td>
                    <td className="text-[var(--palace-gold)] font-semibold">
                      {formatCurrency(sake.price)}
                    </td>
                    <td className="text-[var(--lantern-glow)]">+{sake.drunkPoints}</td>
                    <td className="text-sm opacity-70 max-w-md">{sake.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        {/* ========== SUMMARY TAB ========== */}
        <Tabs.Content value="summary" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-4xl font-bold text-[var(--palace-gold)]">
                {openTabs.length}
              </div>
              <div className="text-sm opacity-60">Open Tabs</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-[var(--lantern-glow)]">
                {totalOrders}
              </div>
              <div className="text-sm opacity-60">Total Orders</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-[var(--success)]">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-sm opacity-60">Total Revenue</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open Tabs Summary */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-[var(--palace-gold)]">
                  Open Tabs Summary
                </h2>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Orders</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {openTabs.map((tab) => {
                    const tanuki = getTanukiById(tab.tanukiId);
                    const drunkLevel = getTanukiDrunkLevel(tab.tanukiId);
                    if (!tanuki) return null;
                    return (
                      <tr key={tab.tanukiId}>
                        <td>
                          <span className={drunkLevel !== 'sober' ? 'drunk-wobble inline-block' : ''}>
                            {tanuki.avatar}
                          </span>{' '}
                          {tanuki.name}
                        </td>
                        <td>{tab.orders.length}</td>
                        <td>
                          <span className={getDrunkLevelBadgeClass(drunkLevel)}>
                            {drunkLevelEmoji[drunkLevel]}
                          </span>
                        </td>
                        <td className="font-semibold text-[var(--palace-gold)]">
                          {formatCurrency(getTabTotal(tab.tanukiId))}
                        </td>
                      </tr>
                    );
                  })}
                  {openTabs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center opacity-50 py-4">
                        No open tabs
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Closed Tabs History */}
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[var(--palace-gold)]">
                  Closed Tabs History
                </h2>
                {closedTabs.length > 0 && (
                  <button className="btn btn-ghost text-sm" onClick={clearClosedTabs}>
                    Clear History
                  </button>
                )}
              </div>
              {closedTabs.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Orders</th>
                      <th>Closed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closedTabs.slice(-10).reverse().map((tab, idx) => {
                      const tanuki = getTanukiById(tab.tanukiId);
                      if (!tanuki) return null;
                      return (
                        <tr key={idx}>
                          <td>
                            {tanuki.avatar} {tanuki.name}
                          </td>
                          <td>{tab.orders.length}</td>
                          <td className="text-sm opacity-60">
                            {tab.closedAt && formatTime(tab.closedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-center opacity-50 py-8">No closed tabs</p>
              )}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
