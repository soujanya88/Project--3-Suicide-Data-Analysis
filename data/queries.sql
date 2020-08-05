-- Interactive choropleth map with hover – by city and suicide number
-- Line chart – number of suicides by age
-- Bar chart – Top 10 countries by number of suicides
-- Pie chart – Male vs Female suicide rate
-- Scatter plot – check for correlation between GDP and number of suicides
-- Scatter plot – Y- axis – beginning year of dataset, X-axis – ending year of our dataset

-- DROP TABLE suicidedata;
SELECT * FROM suicidedata;

-- ALTER COLUMN TYPE
ALTER TABLE suicidedata ALTER COLUMN gdp_for_year TYPE BIGINT USING gdp_for_year::bigint;
ALTER TABLE suicidedata ALTER COLUMN hdi_for_year TYPE float USING hdi_for_year::float;

-- suicide number by age
SELECT age, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY age ORDER BY suicides DESC;
-- suicide number by age group in 2016
SELECT age, SUM(suicides_no) AS suicides FROM suicidedata WHERE year = 2011 GROUP BY age ORDER BY suicides DESC;
-- Yearly Suicides by Age Groups
SELECT year, age, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY year,age;

-- suicide number by country
SELECT country, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY country ORDER BY suicides DESC;
-- suicide number by country in 2016 and 1985
SELECT country, SUM(suicides_no) AS suicides FROM suicidedata WHERE year=2015 GROUP BY country ORDER BY suicides DESC;
SELECT country, SUM(suicides_no) AS suicides FROM suicidedata WHERE year=1985 GROUP BY country ORDER BY suicides DESC;

-- suicide number by generation
SELECT generation, SUM(suicides_no) AS suicides FROM suicide_data GROUP BY generation ORDER BY suicides DESC;

-- suicide number by gender
SELECT sex, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY sex;
-- yearly suicides by gender
SELECT year, sex, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY year,sex;

-- yearly suicide rates and gdp per capita
SELECT year, AVG(derivedTable.suicidesper100pop) AS suicide_rates, AVG(derivedTable.gdp_per_capita) AS gdp_per_capita
FROM (SELECT country,year,SUM(suicidesper100pop) AS suicidesper100pop,MAX(gdp_per_capita) AS gdp_per_capita FROM suicidedata WHERE hdi_for_year <>0 GROUP BY country,year)
AS derivedTable
GROUP BY year;

-- Average suicides rates and hdi by country
SELECT country,AVG(suicidesper100pop) AS suicides, MAX(hdi_for_year) AS hdi FROM suicidedata WHERE hdi_for_year <>0 GROUP BY country,year;
-- Average (of yearly) suicide rates and hdi by country
SELECT country, AVG(derivedtable.suicide_rates) AS avg_suicide_rates, AVG(derivedTable.hdi) AS hdi FROM (SELECT year, country, SUM(suicidesper100pop) AS suicide_rates, MAX(hdi_for_year) AS hdi FROM suicidedata WHERE hdi_for_year <>0 GROUP BY year, country ORDER BY year) AS derivedTable GROUP BY country ;

-- total suicides by age, country, and year
SELECT year,age, country, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY age, country,year ORDER BY year;