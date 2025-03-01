
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Material {
  id: string;
  name: string;
  unit: string;
}

interface StockItem {
  id: string;
  period: Date;
  materialId: string;
  quantity: number;
}

const StockPage = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStock, setCurrentStock] = useState<StockItem | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Date | undefined>(new Date());
  const [filteredPeriod, setFilteredPeriod] = useState<Date | undefined>(new Date());
  
  const [formData, setFormData] = useState({
    materialId: "",
    quantity: "",
    period: new Date(),
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMaterials([
        { id: "1", name: "Terigu", unit: "kg" },
        { id: "2", name: "Gula", unit: "kg" },
        { id: "3", name: "Telur", unit: "kg" },
        { id: "4", name: "Ragi", unit: "kg" },
        { id: "5", name: "Keju", unit: "kg" },
      ]);
      
      const currentDate = new Date();
      const lastMonth = new Date(currentDate);
      lastMonth.setMonth(currentDate.getMonth() - 1);
      const twoMonthsAgo = new Date(currentDate);
      twoMonthsAgo.setMonth(currentDate.getMonth() - 2);
      
      const sampleStockData: StockItem[] = [
        { id: "1", period: currentDate, materialId: "1", quantity: 200 },
        { id: "2", period: currentDate, materialId: "2", quantity: 150 },
        { id: "3", period: currentDate, materialId: "3", quantity: 100 },
        { id: "4", period: currentDate, materialId: "4", quantity: 50 },
        { id: "5", period: currentDate, materialId: "5", quantity: 120 },
        { id: "6", period: lastMonth, materialId: "1", quantity: 180 },
        { id: "7", period: lastMonth, materialId: "2", quantity: 140 },
        { id: "8", period: lastMonth, materialId: "3", quantity: 90 },
        { id: "9", period: lastMonth, materialId: "4", quantity: 45 },
        { id: "10", period: lastMonth, materialId: "5", quantity: 110 },
        { id: "11", period: twoMonthsAgo, materialId: "1", quantity: 160 },
        { id: "12", period: twoMonthsAgo, materialId: "2", quantity: 130 },
        { id: "13", period: twoMonthsAgo, materialId: "3", quantity: 80 },
        { id: "14", period: twoMonthsAgo, materialId: "4", quantity: 40 },
        { id: "15", period: twoMonthsAgo, materialId: "5", quantity: 100 },
      ];
      
      setStockItems(sampleStockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, period: date });
      setSelectedPeriod(date);
    }
  };
  
  const handleFilterPeriodChange = (date: Date | undefined) => {
    if (date) {
      setFilteredPeriod(date);
    }
  };

  const handleAddStock = () => {
    // In a real app, this would call the API
    const newStock: StockItem = {
      id: Date.now().toString(),
      materialId: formData.materialId,
      quantity: Number(formData.quantity),
      period: formData.period,
    };
    
    setStockItems([...stockItems, newStock]);
    toast.success("Stok berhasil ditambahkan");
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditStock = () => {
    if (!currentStock) return;
    
    // In a real app, this would call the API
    const updatedStocks = stockItems.map((stock) =>
      stock.id === currentStock.id
        ? {
            ...stock,
            materialId: formData.materialId,
            quantity: Number(formData.quantity),
            period: formData.period,
          }
        : stock
    );
    
    setStockItems(updatedStocks);
    toast.success("Stok berhasil diperbarui");
    resetForm();
    setIsDialogOpen(false);
    setIsEditing(false);
  };

  const handleDeleteStock = (id: string) => {
    // In a real app, this would call the API
    setStockItems(stockItems.filter((stock) => stock.id !== id));
    toast.success("Stok berhasil dihapus");
  };

  const prepareEdit = (stock: StockItem) => {
    setCurrentStock(stock);
    setFormData({
      materialId: stock.materialId,
      quantity: stock.quantity.toString(),
      period: stock.period,
    });
    setSelectedPeriod(stock.period);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      materialId: "",
      quantity: "",
      period: new Date(),
    });
    setSelectedPeriod(new Date());
    setCurrentStock(null);
  };

  const filteredStocks = stockItems.filter((stock) => {
    if (!filteredPeriod) return true;
    
    const stockDate = new Date(stock.period);
    const filterDate = new Date(filteredPeriod);
    
    return (
      stockDate.getMonth() === filterDate.getMonth() &&
      stockDate.getFullYear() === filterDate.getFullYear()
    );
  });
  
  const getMaterialName = (id: string) => {
    const material = materials.find((m) => m.id === id);
    return material ? material.name : "Unknown";
  };
  
  const getMaterialUnit = (id: string) => {
    const material = materials.find((m) => m.id === id);
    return material ? material.unit : "";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stok Bahan Baku</h2>
          <p className="text-muted-foreground">
            Kelola stok bahan baku yang tersedia.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                resetForm();
                setIsEditing(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Stok
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Stok Bahan Baku" : "Tambah Stok Bahan Baku"}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Perbarui informasi stok bahan baku di sini." 
                  : "Masukkan data stok bahan baku baru di sini."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="period" className="text-right">
                  Periode
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedPeriod && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedPeriod ? (
                          format(selectedPeriod, "MMMM yyyy")
                        ) : (
                          <span>Pilih periode</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedPeriod}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="material" className="text-right">
                  Bahan Baku
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.materialId}
                    onValueChange={(value) => handleSelectChange("materialId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bahan baku" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Jumlah
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.materialId && getMaterialUnit(formData.materialId)}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                type="submit" 
                onClick={isEditing ? handleEditStock : handleAddStock}
                disabled={!formData.materialId || !formData.quantity}
              >
                {isEditing ? "Perbarui" : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filteredPeriod && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filteredPeriod ? (
                  format(filteredPeriod, "MMMM yyyy")
                ) : (
                  <span>Pilih periode</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filteredPeriod}
                onSelect={handleFilterPeriodChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Bahan</TableHead>
                {materials.map((material) => (
                  <TableHead key={material.id}>{material.name}</TableHead>
                ))}
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={materials.length + 2} className="h-24 text-center">
                    <div className="flex justify-center">
                      <div className="animate-pulse space-y-2">
                        <div className="h-2.5 bg-gray-200 rounded-full w-24 mb-2.5"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full w-32"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={materials.length + 2} className="h-24 text-center">
                    Tidak ada data stok untuk periode ini
                  </TableCell>
                </TableRow>
              ) : (
                // Group by period and then display one row per period
                Array.from(
                  new Set(
                    filteredStocks.map((stock) => 
                      `${stock.period.getMonth()}-${stock.period.getFullYear()}`
                    )
                  )
                ).map((periodKey) => {
                  const [month, year] = periodKey.split("-");
                  const date = new Date();
                  date.setMonth(parseInt(month));
                  date.setFullYear(parseInt(year));
                  
                  const periodStocks = filteredStocks.filter((stock) => 
                    stock.period.getMonth() === parseInt(month) && 
                    stock.period.getFullYear() === parseInt(year)
                  );
                  
                  return (
                    <TableRow key={periodKey} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {format(date, "MMM yyyy")}
                      </TableCell>
                      
                      {materials.map((material) => {
                        const stockForMaterial = periodStocks.find(
                          (stock) => stock.materialId === material.id
                        );
                        
                        return (
                          <TableCell key={material.id}>
                            {stockForMaterial ? 
                              `${stockForMaterial.quantity} ${material.unit}` : 
                              "-"}
                          </TableCell>
                        );
                      })}
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {periodStocks.map((stock) => (
                            <div key={stock.id} className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => prepareEdit(stock)}
                              >
                                <Pencil className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteStock(stock.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
