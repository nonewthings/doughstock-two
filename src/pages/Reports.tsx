
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Download } from "lucide-react";

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

const Reports = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      
      const now = new Date();
      const generateHistoricalData = (materialId: string, baseQuantity: number): StockItem[] => {
        const results: StockItem[] = [];
        
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - i);
          const randomFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
          
          results.push({
            id: `${materialId}-${i}`,
            period: date,
            materialId,
            quantity: Math.round(baseQuantity * randomFactor),
          });
        }
        
        return results;
      };
      
      const stockData: StockItem[] = [
        ...generateHistoricalData("1", 200),
        ...generateHistoricalData("2", 150),
        ...generateHistoricalData("3", 100),
        ...generateHistoricalData("4", 50),
        ...generateHistoricalData("5", 120),
      ];
      
      setStockItems(stockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Mock function to handle report download
  const handleDownloadReport = (reportType: string) => {
    console.log(`Downloading ${reportType} report...`);
    // In a real app, this would generate and download a report
  };

  // Function to get aggregated data by period
  const getStockByPeriod = () => {
    const result: Record<string, Record<string, number>> = {};
    
    stockItems.forEach((item) => {
      const period = `${item.period.getMonth()}-${item.period.getFullYear()}`;
      
      if (!result[period]) {
        result[period] = {};
      }
      
      result[period][item.materialId] = item.quantity;
    });
    
    return Object.entries(result)
      .map(([periodKey, materials]) => {
        const [month, year] = periodKey.split("-");
        return {
          period: new Date(parseInt(year), parseInt(month)),
          materials,
        };
      })
      .sort((a, b) => a.period.getTime() - b.period.getTime());
  };

  // Get aggregated data
  const stockByPeriod = getStockByPeriod();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Laporan</h2>
        <p className="text-muted-foreground">
          Lihat dan unduh laporan stok bahan baku.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Laporan Stok Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              Laporan stok bahan baku per bulan.
            </p>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleDownloadReport("monthly")}
            >
              <Download className="mr-2 h-4 w-4" />
              Unduh Laporan
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Laporan Prediksi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              Laporan hasil prediksi stok bahan baku.
            </p>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleDownloadReport("prediction")}
            >
              <Download className="mr-2 h-4 w-4" />
              Unduh Laporan
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Laporan Tahunan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              Laporan stok bahan baku tahunan.
            </p>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleDownloadReport("yearly")}
            >
              <Download className="mr-2 h-4 w-4" />
              Unduh Laporan
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="bg-muted/20 pb-4">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Rekap Stok Bahan Baku
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[150px]">Periode</TableHead>
                  {materials.map((material) => (
                    <TableHead key={material.id}>{material.name}</TableHead>
                  ))}
                  <TableHead>Total</TableHead>
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
                ) : stockByPeriod.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={materials.length + 2} className="h-24 text-center">
                      Tidak ada data stok
                    </TableCell>
                  </TableRow>
                ) : (
                  stockByPeriod.map((item, index) => {
                    // Calculate total for this period
                    const total = Object.values(item.materials).reduce(
                      (sum, qty) => sum + qty, 
                      0
                    );
                    
                    return (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {`${item.period.toLocaleString('default', { month: 'short' })} ${item.period.getFullYear()}`}
                        </TableCell>
                        
                        {materials.map((material) => (
                          <TableCell key={material.id}>
                            {item.materials[material.id] !== undefined
                              ? `${item.materials[material.id]} ${material.unit}`
                              : "-"}
                          </TableCell>
                        ))}
                        
                        <TableCell className="font-medium">
                          {total} kg
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => handleDownloadReport("summary")}
              className="text-sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Unduh Rekap
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
