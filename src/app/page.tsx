// 'use client';
// import { useState } from 'react';
// import { finnhubClient, symbolLookup } from '@/app/_components/StockFinhub';
// import 'bootstrap/dist/css/bootstrap.min.css';

// interface Stock {
//   code: string;
//   name: string;
//   price?: number;
// }

// const StockTable = () => {
//   const [stocks, setStocks] = useState<Stock[]>([]);
//   const [newCode, setNewCode] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
//   const [isRefreshingAll, setIsRefreshingAll] = useState(false);

//   const fetchStockPrice = (symbol: string): Promise<number> => {
//     return new Promise((resolve, reject) => {
//       finnhubClient.quote(symbol, (error: any, data: any) => {
//         if (error) return reject(error);
//         resolve(data.c);
//       });
//     });
//   };

//   const addStock = async () => {
//     if (!newCode.trim()) return;
//     setIsLoading(true);

//     const code = newCode.toUpperCase();
//     try {
//       const [price, name] = await Promise.all([
//         fetchStockPrice(code),
//         symbolLookup(code),
//       ]);
//       const stock: Stock = { code, name, price };
//       setStocks([...stocks, stock]);
//       setNewCode('');
//     } catch (err) {
//       alert('Failed to fetch stock data.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const refreshStock = async (index: number) => {
//     setLoadingIndex(index);
//     try {
//       const updatedStocks = [...stocks];
//       const price = await fetchStockPrice(updatedStocks[index].code);
//       updatedStocks[index].price = price;
//       setStocks(updatedStocks);
//     } catch (err) {
//       alert('Failed to refresh stock.');
//     } finally {
//       setLoadingIndex(null);
//     }
//   };

//   const refreshAll = async () => {
//     setIsRefreshingAll(true);
//     try {
//       const updated = await Promise.all(
//         stocks.map(async (stock) => ({
//           ...stock,
//           price: await fetchStockPrice(stock.code),
//         }))
//       );
//       setStocks(updated);
//     } catch (err) {
//       alert('Failed to refresh all stocks.');
//     } finally {
//       setIsRefreshingAll(false);
//     }
//   };

//   return (
//     <div className="container py-4">
//       <h1 className="mb-4">📈 Stock Prices</h1>

//       <div className="row g-2 mb-3">
//         <div className="col-md-8">
//           <input
//             type="text"
//             placeholder="Enter Stock Code (e.g. AAPL)"
//             className="form-control"
//             value={newCode}
//             onChange={(e) => setNewCode(e.target.value)}
//           />
//         </div>
//         <div className="col-md-2 d-grid">
//           <button
//             onClick={addStock}
//             className="btn btn-primary"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <span className="spinner-border spinner-border-sm" role="status" />
//             ) : (
//               'Add Stock'
//             )}
//           </button>
//         </div>
//         <div className="col-md-2 d-grid">
//           <button
//             onClick={refreshAll}
//             className="btn btn-success"
//             disabled={isRefreshingAll}
//           >
//             {isRefreshingAll ? (
//               <span className="spinner-border spinner-border-sm" role="status" />
//             ) : (
//               'Refresh All'
//             )}
//           </button>
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-bordered table-hover align-middle">
//           <thead className="table-light">
//             <tr>
//               <th>Code</th>
//               <th>Name</th>
//               <th>Last Price</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stocks.length > 0 ? (
//               stocks.map((stock, i) => (
//                 <tr key={i}>
//                   <td>{stock.code}</td>
//                   <td>{stock.name}</td>
//                   <td>
//                     {stock.price !== undefined ? (
//                       <span className="badge bg-secondary">
//                         ${stock.price.toFixed(2)}
//                       </span>
//                     ) : (
//                       'N/A'
//                     )}
//                   </td>
//                   <td>
//                     <button
//                       onClick={() => refreshStock(i)}
//                       className="btn btn-warning btn-sm"
//                       disabled={loadingIndex === i}
//                     >
//                       {loadingIndex === i ? (
//                         <span className="spinner-border spinner-border-sm" role="status" />
//                       ) : (
//                         'Refresh'
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} className="text-center text-muted py-4">
//                   No stocks added yet.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StockTable;
// StockTable.tsx
'use client';
import { useEffect, useState } from 'react';
import { fetchStockPrice, fetchStockName, generateSession } from '@/app/_components/StockBreeze';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Stock {
  code: string;
  name: string;
  price?: number;
}

const StockTable = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [newCode, setNewCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);

  const addStock = async () => {
    if (!newCode.trim()) return;
    setIsLoading(true);

    const code = newCode.toUpperCase();
    try {
      const [price, name] = await Promise.all([
        fetchStockPrice(code),
        fetchStockName(code)
      ]);
      console.log(price, name)
      const stock: Stock = { code, name, price };
      setStocks([...stocks, stock]);
      setNewCode('');
    } catch (err) {
      alert('Failed to fetch stock data.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStock = async (index: number) => {
    setLoadingIndex(index);
    try {
      const updatedStocks = [...stocks];
      const price = await fetchStockPrice(updatedStocks[index].code);
      updatedStocks[index].price = price;
      setStocks(updatedStocks);
    } catch (err) {
      alert('Failed to refresh stock.');
    } finally {
      setLoadingIndex(null);
    }
  };

  const refreshAll = async () => {
    setIsRefreshingAll(true);
    try {
      const updated = await Promise.all(
        stocks.map(async (stock) => ({
          ...stock,
          price: await fetchStockPrice(stock.code),
        }))
      );
      setStocks(updated);
    } catch (err) {
      alert('Failed to refresh all stocks.');
    } finally {
      setIsRefreshingAll(false);
    }
  };

  useEffect(() => {
    generateSession()
  }, [])
  return (
    <div className="container py-4">
      <h1 className="mb-4">📈 Stock Prices</h1>

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input
            type="text"
            placeholder="Enter Stock Code (e.g. INFY)"
            className="form-control"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-grid">
          <button
            onClick={addStock}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
              'Add Stock'
            )}
          </button>
        </div>
        <div className="col-md-2 d-grid">
          <button
            onClick={refreshAll}
            className="btn btn-success"
            disabled={isRefreshingAll}
          >
            {isRefreshingAll ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
              'Refresh All'
            )}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Last Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length > 0 ? (
              stocks.map((stock, i) => (
                <tr key={i}>
                  <td>{stock.code}</td>
                  <td>{stock.name}</td>
                  <td>
                    {stock.price !== undefined ? (
                      <span className="badge bg-secondary">
                        ₹{stock.price.toFixed(2)}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => refreshStock(i)}
                      className="btn btn-warning btn-sm"
                      disabled={loadingIndex === i}
                    >
                      {loadingIndex === i ? (
                        <span className="spinner-border spinner-border-sm" role="status" />
                      ) : (
                        'Refresh'
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  No stocks added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;