'use client'
import React, { useState } from 'react';
import { Play, Beaker, ArrowRight } from 'lucide-react';

const ChemicalSynthesis = () => {
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Định nghĩa các phản ứng hóa học
  const reactions = [
    { inputs: ['Na', 'Cl2'], outputs: ['NaCl'], name: '2Na + Cl₂ → 2NaCl' },
    { inputs: ['Fe', 'Cl2'], outputs: ['FeCl3'], name: '2Fe + 3Cl₂ → 2FeCl₃' },
    { inputs: ['Cu', 'Cl2'], outputs: ['CuCl2'], name: 'Cu + Cl₂ → CuCl₂' },
    { inputs: ['Cl2', 'H2O'], outputs: ['HCl', 'HClO'], name: 'Cl₂ + H₂O → HCl + HClO' },
    { inputs: ['MnO2', 'HCl'], outputs: ['MnCl2', 'Cl2', 'H2O'], name: 'MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O' },
    { inputs: ['HCl', 'KMnO4'], outputs: ['KCl', 'MnCl2', 'H2O', 'Cl2'], name: '16HCl + 2KMnO₄ → 2KCl + 2MnCl₂ + 8H₂O + 5Cl₂' },
    { inputs: ['NaCl', 'H2O'], outputs: ['Cl2', 'H2', 'NaOH'], name: '2NaCl + 2H₂O → Cl₂ + H₂ + 2NaOH (điện phân)' },
    { inputs: ['K', 'Cl2'], outputs: ['KCl'], name: '2K + Cl₂ → 2KCl' },
    // Thêm phản ứng điện phân nước
    { inputs: ['H2O'], outputs: ['O2', 'H2'], name: '2H₂O → O₂ + 2H₂ (điện phân)' },
    // Thêm các phản ứng để điều chế Na2SO4, H2SO4
    { inputs: ['S', 'O2'], outputs: ['SO2'], name: 'S + O₂ → SO₂' },
    { inputs: ['SO2', 'O2'], outputs: ['SO3'], name: '2SO₂ + O₂ → 2SO₃' },
    { inputs: ['SO3', 'H2O'], outputs: ['H2SO4'], name: 'SO₃ + H₂O → H₂SO₄' },
    { inputs: ['H2SO4', 'NaOH'], outputs: ['Na2SO4', 'H2O'], name: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O' },
    { inputs: ['NaCl'], outputs: ['Na', 'Cl2'], name: '2NaCl → 2Na + Cl₂ (điện phân)' }
  ];

  // Thuật toán tìm kiếm theo chiều rộng (BFS) - tìm tất cả các chất có thể điều chế
  const findSynthesisPath = (availableChemicals, targetChemicals) => {
    const queue = [[availableChemicals, []]];
    const visited = new Set();
    visited.add(JSON.stringify([...availableChemicals].sort()));
    
    let bestResult = { success: false, path: [], finalChemicals: availableChemicals, foundTargets: [] };
    let maxTargetsFound = 0;

    while (queue.length > 0) {
      const [currentChemicals, path] = queue.shift();
      
      // Đếm số chất mục tiêu đã tìm được
      const foundTargets = targetChemicals.filter(target => 
        currentChemicals.has(target)
      );
      
      // Cập nhật kết quả tốt nhất nếu tìm được nhiều chất hơn
      if (foundTargets.length > maxTargetsFound) {
        maxTargetsFound = foundTargets.length;
        bestResult = { 
          success: true, 
          path, 
          finalChemicals: currentChemicals, 
          foundTargets 
        };
        
        // Nếu tìm được tất cả thì dừng luôn
        if (foundTargets.length === targetChemicals.length) {
          return bestResult;
        }
      }

      // Giới hạn độ sâu tìm kiếm để tránh chạy quá lâu
      if (path.length >= 10) continue;

      // Thử tất cả các phản ứng có thể thực hiện
      for (const reaction of reactions) {
        // Kiểm tra xem có đủ chất tham gia phản ứng không
        const canReact = reaction.inputs.every(input => 
          currentChemicals.has(input)
        );

        if (canReact) {
          // Tạo tập chất mới sau phản ứng
          const newChemicals = new Set(currentChemicals);
          reaction.outputs.forEach(output => newChemicals.add(output));

          const stateKey = JSON.stringify([...newChemicals].sort());
          
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            const newPath = [...path, reaction];
            queue.push([newChemicals, newPath]);
          }
        }
      }
    }

    return bestResult;
  };

  const runSynthesis = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      const initialChemicals = new Set(['S', 'H2O', 'NaCl']);
      const targetChemicals = ['Na2SO4', 'H2SO4', 'HCl', 'Na'];
      
      const result = findSynthesisPath(initialChemicals, targetChemicals);
      
      setResult(result);
      setIsRunning(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Beaker className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Hệ thống điều chế hóa học
            </h1>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-indigo-900 mb-3">
              Bài toán
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Chất ban đầu:</strong> S, H₂O, NaCl</p>
              <p><strong>Chất cần điều chế:</strong> Ít nhất một trong: Na₂SO₄, H₂SO₄, HCl, Na</p>
            </div>
          </div>

          <button
            onClick={runSynthesis}
            disabled={isRunning}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5" />
            {isRunning ? 'Đang tìm kiếm...' : 'Tìm phương án điều chế'}
          </button>

          {result && (
            <div className="mt-8">
              {result.success ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      ✓ Tìm thấy phương án điều chế!
                    </h3>
                    <p className="text-green-800">
                      Số bước: {result.path.length}
                    </p>
                    <p className="text-green-800 font-semibold mt-2">
                      Đã điều chế được {result.foundTargets.length}/4 chất: 
                      <span className="text-green-900"> {result.foundTargets.join(', ')}</span>
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Các bước điều chế:
                    </h3>
                    <div className="space-y-4">
                      {result.path.map((reaction, index) => (
                        <div
                          key={index}
                          className="bg-white border-l-4 border-indigo-500 p-4 rounded shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <span className="bg-indigo-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium">
                                {reaction.name}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <span>
                                  Từ: {reaction.inputs.join(', ')}
                                </span>
                                <ArrowRight className="w-4 h-4" />
                                <span>
                                  Tạo: {reaction.outputs.join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Các chất thu được:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[...result.finalChemicals].sort().map((chemical) => (
                        <span
                          key={chemical}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {chemical}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-6">
                  <h3 className="text-lg font-semibold text-red-900">
                    Không tìm thấy phương án điều chế
                  </h3>
                  <p className="text-red-800 mt-2">
                    Với các phản ứng đã cho, không thể điều chế đủ các chất cần thiết.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Giải thích thuật toán:
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Sử dụng thuật toán tìm kiếm theo chiều rộng (BFS)</li>
              <li>• Bắt đầu từ tập chất ban đầu</li>
              <li>• Thử tất cả các phản ứng có thể thực hiện</li>
              <li>• Lưu trạng thái để tránh lặp lại</li>
              <li>• Dừng khi tìm được tất cả chất cần điều chế</li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ChemicalSynthesis;