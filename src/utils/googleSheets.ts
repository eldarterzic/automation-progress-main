import * as XLSX from 'xlsx';
import { UseCase } from '@/types/use-case';

export interface ReportingData {
  id?: string;
  useCaseId?: string;
  year?: string;
  month?: string;
  revenue?: number;
  impact?: number;
  investment?: number;
}

export const parseGoogleSheet = (file: File, useCases: UseCase[]): Promise<{ useCases: UseCase[]; reportingData: ReportingData[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Function to safely get data from sheet
        const getSheetData = (sheetName: string) => {
          const sheet = workbook.Sheets[sheetName];
          return sheet ? XLSX.utils.sheet_to_json(sheet, { header: 1 }) : [];
        };

        // Parse Use Cases
        const useCasesSheetData = getSheetData('Use Cases');
        const parsedUseCases = parseUseCasesSheet(useCasesSheetData);

        // Parse Target Automation Levels
        const targetLevelsSheetData = getSheetData('Target Automation Levels');
        const parsedTargetLevels = parseTargetLevelsSheet(targetLevelsSheetData, parsedUseCases);

        // Parse Reporting Data
        const reportingDataSheetData = getSheetData('Reporting Data');
        const parsedReportingData = parseReportingDataSheet(reportingDataSheetData);

        // Merge target levels into use cases
        const mergedUseCases = parsedUseCases.map(useCase => {
          const targetLevelData = parsedTargetLevels.find(target => target.id === useCase.id);
          return {
            ...useCase,
            targetLevel: targetLevelData ? targetLevelData.targetLevel : useCase.targetLevel,
          };
        });

        resolve({ useCases: mergedUseCases, reportingData: parsedReportingData });
      } catch (error) {
        console.error("Error parsing Google Sheet:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

const parseUseCasesSheet = (sheetData: any[][]): UseCase[] => {
  const headers = sheetData[0] as string[];
  const dataRows = sheetData.slice(1) as any[][];

  return dataRows.map(row => {
    const useCase: UseCase = {
      id: row[0] || '',
      name: row[1] || '',
      description: row[2] || '',
      category: row[3] || '',
      currentLevel: parseInt(row[4], 10) || 0,
      targetLevel: parseInt(row[5], 10) || 0,
      inProduction: row[6]?.toString().toLowerCase() === 'true',
      developmentYear: parseInt(row[7], 10) || undefined,
    };
    return useCase;
  });
};

interface TargetLevel {
  id: string;
  targetLevel: number;
}

const parseTargetLevelsSheet = (sheetData: any[][], existingUseCases: UseCase[]): TargetLevel[] => {
  const headers = sheetData[0] as string[];
  const dataRows = sheetData.slice(1) as any[][];

  return dataRows.map(row => {
    const id = row[0] as string;
    const targetLevel = parseInt(row[1], 10);

    return {
      id: id,
      targetLevel: targetLevel,
    };
  });
};

const parseReportingDataSheet = (sheetData: any[][]): ReportingData[] => {
  const headers = sheetData[0] as string[];
  const dataRows = sheetData.slice(1) as any[][];

  return dataRows.map(row => {
    const reportingData: ReportingData = {
      id: row[0] || '',
      useCaseId: row[1] || '',
      year: row[2] || '',
      month: row[3] || '',
      revenue: parseFloat(row[4]) || 0,
      impact: parseFloat(row[5]) || 0,
      investment: parseFloat(row[6]) || 0,
    };
    return reportingData;
  });
};
