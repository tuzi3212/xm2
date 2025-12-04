const { createApp, ref, reactive, computed, watch, onMounted, nextTick } = Vue;

createApp({
    data() {
        return {
            // 存储城市数据
            cities: [
                { name: '成都', id: 1, scores: { cost: 80, food: 90, culture: 85, nature: 70, safety: 75 }, description: '成都简介' },
                { name: '北京', id: 2, scores: { cost: 50, food: 70, culture: 90, nature: 60, safety: 80 }, description: '北京简介' },
                { name: '上海', id: 3, scores: { cost: 60, food: 80, culture: 90, nature: 70, safety: 85 }, description: '上海简介' }
            ],
            selectedCity: null, // 当前选择的城市
            preferences: { cost: 50, food: 50, culture: 50, nature: 50, safety: 50 }, // 用户偏好设置
            filters: { region: 'all', type: '全部' }, // 筛选条件
            tripDays: 5, // 旅行天数
            chartInstance: null, // 图表实例
        };
    },
    computed: {
        // 根据用户偏好和筛选条件，计算出排名的城市
        rankedCities() {
            return this.cities.map(city => {
                let totalScore = 0;
                let totalWeight = 0;
                for (const key in this.preferences) {
                    const weight = this.preferences[key];
                    const score = city.scores[key];
                    totalScore += score * weight;
                    totalWeight += weight;
                }
                const finalScore = totalWeight === 0 ? 0 : (totalScore / totalWeight);
                return { ...city, matchScore: finalScore };
            }).sort((a, b) => b.matchScore - a.matchScore);
        },
    },
    methods: {
        // 选择城市
        selectCity(city) {
            this.selectedCity = city;
            this.updateChart(); // 更新图表
        },
        // 更新雷达图
        updateChart() {
            const ctx = document.getElementById('radarChart').getContext('2d');
            const dataValues = [
                this.selectedCity.scores.cost,
                this.selectedCity.scores.food,
                this.selectedCity.scores.culture,
                this.selectedCity.scores.nature,
                this.selectedCity.scores.safety,
            ];

            // 如果图表已经存在，更新数据
            if (this.chartInstance) {
                this.chartInstance.data.datasets[0].data = dataValues;
                this.chartInstance.data.datasets[0].label = this.selectedCity.name;
                this.chartInstance.update();
            } else {
                // 如果图表不存在，初始化图表
                this.chartInstance = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['性价比', '美食', '文化', '自然', '设施'],
                        datasets: [{
                            label: this.selectedCity.name,
                            data: dataValues,
                            fill: true,
                            backgroundColor: 'rgba(0, 122, 255, 0.16)',
                            borderColor: '#007AFF',
                            pointBackgroundColor: '#fff',
                            pointBorderColor: '#007AFF',
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                angleLines: { color: '#f5f5f4' },
                                grid: { color: '#e7e5e4' },
                                ticks: { display: false },
                            }
                        }
                    }
                });
            }
        },
    },
    mounted() {
        // 默认选择第一个城市
        this.selectCity(this.cities[0]);
    }
}).mount('#app');