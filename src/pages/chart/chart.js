import { sendGetAdsRequest } from '../requests.js';
import { removeChildrens, createNewElement } from '../functions.js';

export default class ChartPage {
    constructor(root) {
        this.root = root;
        this.data = null;
        this.tableHeaders = ['Compaing', 'Time', 'Views', 'Visitors', 'CTR', 'CPC', 'CPV', 'CPM', 'Status'];
        this.tableValues = ['name', 'time', 'views', 'visitors','ctr', 'cpc', 'cpv','cpm', 'status'];
        this.currentItem = null;
    }

    async create() {
        try {
            let data = await sendGetAdsRequest('week' ,localStorage.token);
            
            if (data.status === 200) {
                this.data = await data.json();
            } else throw new Error('bad request');
           
            if (this.data.length > 0) {

                console.log(this.data);
            
                this.chartRoot = createNewElement('div', '', ['chart']);

                let chartHeader= createNewElement('div','', ['chart-header']);

                
                this.donutsContainer = createNewElement('div', '', ['chart-header__donuts-container']);

                this.daigram = createNewElement('div', '', ['ct-chart', 'line']);

                chartHeader.append(this.donutsContainer, this.createSelectPeriod());
                this.chartRoot.append(chartHeader, this.daigram);

                this.tableRoot = createNewElement('div', '', ['chart-table']);
                
                this.root.append(this.chartRoot, this.tableRoot);

                let thead = this.createHeader();
                let body = this.createTableItems(this.data);
                
                removeChildrens(this.tableRoot);
                this.createTable(thead, body);

                body.firstChild.click();

            } else {
                let container = createNewElement('div', '', ['content__wait-screen']); 
                let message = createNewElement('p', 'No data privided', ['content__text'])
                container.append(message);
                this.root.append(container);
            }
        
        } catch(error){ 
            console.log(error);
        } 
    }

    createSelectPeriod() {
        let selectContainer = createNewElement('div','', ['chart-header__select-container']);
        let span = createNewElement('span', 'Show', ['chart-header__text']); 
        let select = createNewElement('select', '', ['chart-header__select']);

        let option1 = createNewElement('option', 'week');
        option1.value = 'week';

        let option2 = createNewElement('option', 'month');
        option2.value = 'month';

        select.append(option1, option2);

        let createNewtable = async (timePeriod) => {
            let data = await sendGetAdsRequest(timePeriod, localStorage.token);
            
            if (data.status === 200) {
                this.data = await data.json();
            } else throw new Error('bad request');

            let thead = this.createHeader();
            let body = this.createTableItems(this.data);

            removeChildrens(this.tableRoot);
            this.createTable(thead, body);
            
            body.firstChild.click();
        }

        select.addEventListener('change', (e) => {
            createNewtable(e.target.value);
        });

        selectContainer.append(span, select)

        return selectContainer;
    }

    createChart(data) {
        this.createDonutChart(data, data);
        this.renderChart(data);

    }

    createDonutChart(day, data) {
        for (let i = 1; i <= 3; i++) {
            let donutBlock = createNewElement('div', '', ['chart-header__donuts-block']);
            let donut = createNewElement('div', '', ['ct-chart', 'donut', 'donut_'+i]); 
            let description = createNewElement('div','', ['donut__description']);
            donutBlock.append(donut, description);
            
            this.donutsContainer.append(donutBlock);
        }

        this.renderDonutChart(day, data, 'views', 'donut_1');
        this.renderDonutChart(day, data, 'visitors', 'donut_2');
        this.renderDonutChart(day, data, 'impressions', 'donut_3');
    }

    renderDonutChart(dataCurrent, dataGeneral, type, name) {
        let firstStroke = Math.round((dataCurrent[type]/dataGeneral[type]) * 100)
        let secondStroke = 100 - firstStroke;

        let donutPercentValue = createNewElement('span', firstStroke + '%', ['donut__text'])

        new Chartist.Pie('.'+name, {
            series: [firstStroke, secondStroke]
          }, {
            donut: true,
            donutWidth: 6,
            // donutSolid: true,
            startAngle: 0,
            showLabel: false,
            height: '80px',
            width: '80px'
          });

          let donut = document.getElementsByClassName(name)[0];
          donut.append(donutPercentValue);

          let donutDescription = donut.parentElement.children[1];

          let stat = createNewElement('span', dataCurrent[type], ['donut__stat']);
          let title = createNewElement('span', type, ['donut__title']);

          donutDescription.append(stat, title);

    }

    renderChart(data) {
        var chartData = {
            
            labels: data.daily_stats.map((el) => el.weekday),
            series: [
              data.daily_stats.map((el) => el.views)
            ],
        };

        let header = this.chartRoot.firstChild;
        var chartOptions = {
            width: '100%',
            
            // for some reason i can not just apply height: 100%, so i am setting it in p, 
            //but pixels quite wrong, so i multiply it by 0.9. Althought and that is strange,
            // because if i try to get height of container (chart) in console everything is ok   
            height: (0.9*(this.chartRoot.offsetHeight - header.offsetHeight) + 'px'),
            fullWidth: true,
            showArea: true,

            axisY: {
                showGrid: false
            }
        };

        let chart = new Chartist.Line('.line', chartData, chartOptions);

        chart.on("created", () => {
            let days = document.querySelectorAll('.ct-end');
            
            for (let i = 0; i < days.length; i++) {
                days[i].addEventListener('click', () => {
                    removeChildrens(this.donutsContainer);
                    console.log(data)
                    this.createDonutChart(data.daily_stats[i], data);
                    //remove previous active state
                    days.forEach((el) => {
                        if (el.classList.contains('ct-end_active')) {
                            el.classList.remove('ct-end_active');
                        }
                    });
                    days[i].classList.add('ct-end_active')

                    let points = document.querySelectorAll('.ct-point');
                    // console.log(points)
                    points.forEach((el) => {
                        if (el.classList.contains('ct-point_active')) {
                            el.classList.remove('ct-point_active');
                        }
                    });
                    points[i].classList.add('ct-point_active')
                })
                console.log(days[i]);
            }
        });

    }


    createTable(thead, body) { 
        this.tableRoot.append(thead, body);
    }

    createHeader() {
        //it happens that i can not set max height to tbody, so i am doing it with list
        let thead = createNewElement('div', '', ['chart-table__header']);

        let headers = [];

        for (let i = 0; i < this.tableHeaders.length; i++) {
            
            let type = this.tableValues[i];
            let tableHeader = createNewElement('span', this.tableHeaders[i], ['chart-table__title']);

            headers.push(tableHeader);
            thead.append(tableHeader);

            tableHeader.addEventListener('click', () => {
            
                //remove active states from previous active element; 
                headers.forEach((el) => {
                    if (el.classList.contains('chart-table__title_active')) {
                        el.classList.remove('chart-table__title_active');
                    }
                });

                let sortedData = this.data.slice().sort((a,b) => {
                    if (a[type] > b[type] )  return 1;
                    if (a[type] == b[type]) return 0;
                    if (a[type] < b[type] )  return -1;
                });

                tableHeader.classList.add('chart-table__title_active');
                
                if (JSON.stringify(this.data) == JSON.stringify(sortedData)) sortedData.reverse();

                this.data = sortedData;

                let sortedTBody = this.createTableItems(sortedData);

                //mark as active current item
                sortedData.forEach((el, index) => {
                    if (el.name == this.currentItem) {
                        sortedTBody.children[index].classList.add('chart-table__row_active');
                    }
                });

                // sortedTBody.firstChild.click();
                removeChildrens(this.tableRoot);
                this.createTable(thead, sortedTBody);
            });
        }

        return thead;
    }

    createTableItems(data) {
        let tbody = createNewElement('ul','',['list', 'chart-table__body']);
        
        let items = [];
        
        for (let i = 0; i < data.length; i++) {
            let li = createNewElement('li', '', ['chart-table__row']);
                       
            let name = createNewElement('span', data[i].name, ['chart-table__data']);
            let time = createNewElement('span', data[i].time, ['chart-table__data']);
            let views = createNewElement('span', data[i].views, ['chart-table__data']);
            let visitors = createNewElement('span', data[i].visitors, ['chart-table__data']);
            let ctr = createNewElement('span', data[i].ctr, ['chart-table__data']);
            let cpc = createNewElement('span', data[i].cpc.toFixed(2), ['chart-table__data', 'chart-table__data_dollar-sign']);
            let cpv = createNewElement('span', data[i].cpv.toFixed(2), ['chart-table__data', 'chart-table__data_dollar-sign']);
            let cpm = createNewElement('span', data[i].cpm.toFixed(2), ['chart-table__data', 'chart-table__data_dollar-sign']);
            let status = createNewElement('span', data[i].status, ['chart-table__data']);
            
            if (data[i].status === 'active') 
                status.classList.add('chart-table__data_state_active');
            else status.classList.add('chart-table__data_state_disabled');

            li.addEventListener('click', () => {
                this.setCurrent(li);
                removeChildrens(this.daigram);
                removeChildrens(this.donutsContainer);
                this.createChart(data[i]);
            });

            items.push(li);
            li.append(name, time, views, visitors, ctr, cpc, cpv, cpm, status);
            tbody.append(li);
        }

        return tbody;
    }

    setCurrent(li) {
        let items = document.getElementsByClassName('chart-table__row')
        
        for (let i = 0; i < items.length; i++) {
            let el = items[i];

            if (el.classList.contains('chart-table__row_active')) {
                el.classList.remove('chart-table__row_active');
            }
        }

        li.classList.add('chart-table__row_active');

        this.currentItem = li.firstChild.textContent;

    }

}
