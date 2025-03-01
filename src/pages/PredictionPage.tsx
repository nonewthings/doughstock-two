
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calculator } from "lucide-react";
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

interface PredictionResult {
  period: string;
  actual: number;
  forecast: number;
  error: number;
  absError: number;
  squaredError: number;
  ape: number;
}

interface PredictionSummary {
  mad: number;
  mse: number;
  mape: number;
}

const PredictionPage = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [weightValue, setWeightValue] = useState<string>("3");
  const [periodCount, setPeriodCount] = useState<string>("3");
  const [predictionResults, setPredictionResults] = useState<PredictionResult[]>([]);
  const [predictionSummary, setPredictionSummary] = useState<PredictionSummary | null>(null);
  const [nextPeriodPrediction, setNextPeriodPrediction] = useState<{ period: string; value: number } | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

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

  const calculateWeightedMovingAverage = () => {
    if (!selectedMaterialId || !weightValue || !periodCount) {
      toast.error("Harap pilih bahan baku dan masukkan nilai bobot terlebih dahulu");
      return;
    }
    
    const weight = Number(weightValue);
    const periods = Number(periodCount);
    
    if (weight <= 0 || periods <= 0) {
      toast.error("Nilai bobot dan jumlah periode harus lebih dari 0");
      return;
    }
    
    // Filter stock items for the selected material and sort by date
    const materialStocks = stockItems
      .filter((item) => item.materialId === selectedMaterialId)
      .sort((a, b) => a.period.getTime() - b.period.getTime());
    
    if (materialStocks.length < periods) {
      toast.error(`Data stok tidak cukup. Minimal diperlukan ${periods} periode.`);
      return;
    }
    
    const results: PredictionResult[] = [];
    let totalError = 0;
    let totalAbsError = 0;
    let totalSquaredError = 0;
    let totalAPE = 0;
    let countForStats = 0;
    
    // Calculate the weighted moving average
    for (let i = periods; i < materialStocks.length; i++) {
      const actualValue = materialStocks[i].quantity;
      
      // Calculate weighted sum of previous periods
      let weightedSum = 0;
      let weightSum = 0;
      
      for (let j = 1; j <= periods; j++) {
        const periodWeight = weight * (periods - j + 1) / ((periods * (periods + 1)) / 2);
        weightedSum += materialStocks[i - j].quantity * periodWeight;
        weightSum += periodWeight;
      }
      
      const forecast = Math.round(weightedSum / weightSum);
      const error = actualValue - forecast;
      const absError = Math.abs(error);
      const squaredError = error * error;
      const ape = (absError / actualValue) * 100;
      
      results.push({
        period: format(materialStocks[i].period, "MMM yyyy"),
        actual: actualValue,
        forecast,
        error,
        absError,
        squaredError,
        ape,
      });
      
      totalError += error;
      totalAbsError += absError;
      totalSquaredError += squaredError;
      totalAPE += ape;
      countForStats++;
    }
    
    // Calculate next period prediction
    const lastPeriods = materialStocks.slice(-periods);
    let weightedSum = 0;
    let weightSum = 0;
    
    for (let j = 0; j < periods; j++) {
      const periodWeight = weight * (periods - j) / ((periods * (periods + 1)) / 2);
      weightedSum += lastPeriods[j].quantity * periodWeight;
      weightSum += periodWeight;
    }
    
    const nextForecast = Math.round(weightedSum / weightSum);
    
    // Calculate next period date
    const lastDate = new Date(materialStocks[materialStocks.length - 1].period);
    const nextPeriodDate = new Date(lastDate);
    nextPeriodDate.setMonth(lastDate.getMonth() + 1);
    
    // Set state with results
    setPredictionResults(results);
    setPredictionSummary({
      mad: countForStats > 0 ? totalAbsError / countForStats : 0,
      mse: countForStats > 0 ? totalSquaredError / countForStats : 0,
      mape: countForStats > 0 ? totalAPE / countForStats : 0,
    });
    
    setNextPeriodPrediction({
      period: format(nextPeriodDate, "MMM yyyy"),
      value: nextForecast,
    });
    
    setHasCalculated(true);
    toast.success("Prediksi berhasil dihitung");
  };

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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Prediksi Stok</h2>
        <p className="text-muted-foreground">
          Hitung prediksi stok menggunakan metode weighted moving average.
        </p>
      </div>

      <Card className="bg-white">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="text-lg font-medium">Input Parameter</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="material">Nama Bahan Baku</Label>
              <Select 
                value={selectedMaterialId}
                onValueChange={setSelectedMaterialId}
              >
                <SelectTrigger id="material">
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

            <div className="space-y-2">
              <Label htmlFor="weight">Nilai Bobot</Label>
              <Input
                id="weight"
                type="number"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                min="1"
                placeholder="Masukkan nilai bobot"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodCount">Jumlah Periode Dianalisa</Label>
              <Input
                id="periodCount"
                type="number"
                value={periodCount}
                onChange={(e) => setPeriodCount(e.target.value)}
                min="1"
                placeholder="Masukkan jumlah periode"
              />
            </div>
          </div>

          <Button 
            onClick={calculateWeightedMovingAverage}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Hitung
          </Button>
        </CardContent>
      </Card>

      {hasCalculated && predictionResults.length > 0 && (
        <>
          <Card className="bg-white">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-lg font-medium">Hasil Perhitungan</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Periode</TableHead>
                      <TableHead>Aktual</TableHead>
                      <TableHead>Prediksi</TableHead>
                      <TableHead>Error</TableHead>
                      <TableHead>|Error|</TableHead>
                      <TableHead>Error²</TableHead>
                      <TableHead>APE (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {predictionResults.map((result, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell>{result.period}</TableCell>
                        <TableCell>{result.actual}</TableCell>
                        <TableCell>{result.forecast}</TableCell>
                        <TableCell>{result.error.toFixed(2)}</TableCell>
                        <TableCell>{result.absError.toFixed(2)}</TableCell>
                        <TableCell>{result.squaredError.toFixed(2)}</TableCell>
                        <TableCell>{result.ape.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {predictionSummary && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">MAD (Mean Absolute Deviation)</p>
                    <p className="text-2xl font-bold">{predictionSummary.mad.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">MSE (Mean Squared Error)</p>
                    <p className="text-2xl font-bold">{predictionSummary.mse.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium">MAPE (Mean Absolute Percentage Error)</p>
                    <p className="text-2xl font-bold">{predictionSummary.mape.toFixed(2)}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {nextPeriodPrediction && (
            <Card className="bg-white">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg font-medium">Hasil Prediksi</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Bahan Baku</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bahan</p>
                      <p className="text-xl font-semibold">{getMaterialName(selectedMaterialId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Periode</p>
                      <p className="text-xl font-semibold">{nextPeriodPrediction.period}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Prediksi Stok</p>
                        <p className="text-2xl font-bold text-primary">{nextPeriodPrediction.value} {getMaterialUnit(selectedMaterialId)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PredictionPage;
