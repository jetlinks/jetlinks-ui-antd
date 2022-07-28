import React from 'react';
import Echart, { echarts } from './echarts';
import styles from './index.less'

type TopEchartsItemNodeType = {
	value: any;
	max?: any;
	title?: string;
	formatter?: string;
	bottom?: string;
};

const GaugeCharts = (props: TopEchartsItemNodeType) => {
	let formatterCount = 0;
	const options = {
		series: [
			{
				type: 'gauge',
				min: 0,
				max: props.max || 100,
				startAngle: 200,
				endAngle: -20,
				center: ['50%', '65%'],
				title: {
					show: false,
				},
				axisTick: {
					distance: -20,
					lineStyle: {
						width: 1,
						color: 'rgba(0,0,0,0.15)',
					},
				},
				splitLine: {
					distance: -22,
					length: 9,
					lineStyle: {
						width: 1,
						color: '#000',
					},
				},
				axisLabel: {
					distance: -22,
					color: 'auto',
					fontSize: 12,
					width: 30,
					padding: [6, -4, 0, -4],
					formatter: (value: number) => {
						formatterCount += 1;
						if ([1, 3, 6, 9, 11].includes(formatterCount)) {
							return value + (props.formatter || '%');
						}
						return '';
					},
				},
				pointer: {
					length: '80%',
					width: 4,
					itemStyle: {
						color: 'auto',
					},
				},
				anchor: {
					show: true,
					showAbove: true,
					size: 20,
					itemStyle: {
						borderWidth: 3,
						borderColor: '#fff',
						shadowBlur: 20,
						shadowColor: 'rgba(0, 0, 0, .25)',
						color: 'auto',
					},
				},
				axisLine: {
					lineStyle: {
						width: 10,
						color: [
							[0.25, 'rgba(36, 178, 118, 1)'],
							[
								0.4,
								new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(66, 147, 255, 1)',
									},
									{
										offset: 1,
										color: 'rgba(36, 178, 118, 1)',
									},
								]),
							],
							[
								0.5,
								new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(250, 178, 71, 1)',
									},
									{
										offset: 1,
										color: 'rgba(66, 147, 255, 1)',
									},
								]),
							],
							[
								1,
								new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(250, 178, 71, 1)',
									},
									{
										offset: 1,
										color: 'rgba(247, 111, 93, 1)',
									},
								]),
							],
						],
					},
				},
				detail: {
					show: false,
				},
				data: [{ value: props.value || 0 }],
			},
		],
	};

	return (
		<div className={styles['echarts-item']}>
			{
				// @ts-ignore
				<Echart options={options} />
			}
		</div>
	);
};

export default GaugeCharts;
