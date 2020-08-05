import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import itertools
from operator import itemgetter

from flask import Flask, jsonify, render_template

conn = 'postgres://fwemcimzozpoxb:2fb7f6660c9c464862e6af2b8b619cbb98ab310536ab502fd8d1c2fc455bfd11@ec2-3-208-50-226.compute-1.amazonaws.com:5432/dak9gr5mjopu5b'
engine = create_engine(conn)

# password = "secu:0502"
# engine = create_engine(f'postgresql://postgres:{password}@localhost:5432/suicide_db')

app = Flask(__name__)

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(engine, reflect=True)
# print(Base.classes.keys())
# # Save reference to the table
# Suicide = Base.classes.suicidedata

@app.route("/")
def index():
    #"""Return the homepage."""
    return render_template("index.html")

@app.route("/gender")
def gender():
    #"""Return the homepage."""
    return render_template("gender.html")

@app.route("/generation")
def generation():
    #"""Return the homepage."""
    return render_template("generation.html")

@app.route("/byCountry")
def byCountry():
    #"""Return the homepage."""
    return render_template("byCountry.html")

@app.route("/yearlyRates")
def yearlyRates():
    #"""Return the homepage."""
    return render_template("yearlyRates.html")

@app.route("/byAge")
def byAge():
    #"""Return the homepage."""
    return render_template("byAge.html")

@app.route("/gdp_scatter")
def gdp_scatter():
    #"""Return the homepage."""
    return render_template("gdp_scatter.html")

@app.route("/hdi_scatter")
def hdi_scatter():
    #"""Return the homepage."""
    return render_template("hdi_scatter.html")

@app.route("/map")
def map():
    #"""Return the homepage."""
    return render_template("map.html")

@app.route("/api/suicides_by_country")
def suicides_by_country():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT c.iso_abr, s.country, s.suicides FROM countrydata c JOIN (SELECT country, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY country) s ON c.name = s.country;")
    print(results)
    output = {}
    for result in results:
        output[result['iso_abr']] = {
            'suicides': int(result['suicides']),
            'iso_abr': result['iso_abr'],
            'country': result['country']
        }
    session.close()
    return jsonify(output)

@app.route("/api/suicides_by_TopTenCountry")
def suicides_by_TopTenCountry():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    results = engine.execute("SELECT country, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY country ORDER By suicides DESC LIMIT 10;")
    
    output = {}
    for result in results:
        output[result['country']] = int(result['suicides'])
    session.close()
    return jsonify(output)

@app.route("/api/suicides_by_gender")
def suicides_by_gender():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    results = engine.execute("SELECT sex, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY sex")
    
    output = {}
    for result in results:
        output[result['sex']] = int(result['suicides'])
    session.close()
    return jsonify(output)

@app.route("/api/yearly_suicides_by_gender")
def yearly_suicides_by_gender():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    results = engine.execute("SELECT year, sex, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY year,sex;")
    
    output = []
    for result in results:
        output.append({
            'year': result['year'],
            'sex': result['sex'],
            'suicides': int(result['suicides'])
        })
    session.close()

    yearly_results = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('year'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['year']):
        yearly_results[key] = list(group)
    return jsonify(yearly_results)

@app.route("/api/yearly_suicides_by_generation")
def yearly_suicides_by_generation_test():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT generation,year, sum(suicides_no) as numsuicides FROM suicidedata GROUP BY year, generation order by year")
    output = []
    for result in results:
        output.append({
            'year': result['year'],
            'generation': result['generation'],
            'numsuicides': int(result['numsuicides'])
        })
    session.close()
    yearly_results = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('year'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['year']):
        yearly_results[key] = list(group)
    return jsonify(yearly_results)

@app.route("/api/suicides_by_generation")
def suicides_by_generation():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT generation, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY generation ORDER BY suicides DESC")
    
    output = {}
    for result in results:
        output[result['generation']] = int(result['suicides'])
    session.close()
    return jsonify(output)


@app.route("/api/suicides_by_age")
def suicides_by_age():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = engine.execute("SELECT age, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY age ORDER BY suicides DESC")
    
    output = {}
    for result in results:
        output[result['age']] = int(result['suicides'])
    session.close()
    return jsonify(output)

@app.route("/api/yearly_suicides_by_age_country")
def yearly_suicides_by_age():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = engine.execute("SELECT year,age, country, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY age, country,year ORDER BY year;")
    
    output = []
    for result in results:
        output.append({
            'year': result['year'],
            'country': result['country'],
            'age': result['age'],
            'suicides': int(result['suicides'])
        })
    session.close()

    country_results = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('country'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['country']):
        country_results[key] = list(group)
    return jsonify(country_results)

# @app.route('/api/suicides_by_age_country')
# def suicides_by_age_country():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)
    
#     results = engine.execute('SELECT age, country, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY age, country ORDER BY suicides')
#     print(results)
#     output = []
#     for result in results:
#         output.append({
#             'country': result['country'],
#             'age': result['age'],
#             'suicides': int(result['suicides'])
#         })
#     session.close()
#     country_results = {}
#     # Sort the results by year
#     sorted_output = sorted(output, key=itemgetter('country'))
#     # Assigning the objects into the same list for the same year data
#     for key, group in itertools.groupby(sorted_output, key=lambda x:x['country']):
#         country_results[key] = list(group)
#     return jsonify(country_results)

@app.route("/api/suicides_and_gdp")
def suicides_and_gdp():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    results = engine.execute("SELECT country, AVG(derivedtable.suicide_rates) AS avg_suicide_rates, AVG(gdp_per_capita) AS avg_gdp_per_capita FROM (SELECT year, country, SUM(suicidesper100pop) AS suicide_rates, MAX(gdp_per_capita) AS gdp_per_capita FROM suicidedata GROUP BY year, country ORDER BY year) AS derivedTable GROUP BY country;")
    
    output = {}
    for result in results:
        output[result['country']] = {
            'suicides': int(result['avg_suicide_rates']),
            'gdp': int(result['avg_gdp_per_capita'])
        }
    session.close()
    return jsonify(output)

@app.route("/api/yearly_suicides_and_gdp")
def yearly_suicides_and_gdp():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    results = engine.execute("SELECT year, AVG(derivedTable.suicidesper100pop) AS suicide_rates, AVG(derivedTable.gdp_per_capita) AS gdp_per_capita FROM (SELECT country,year,SUM(suicidesper100pop) AS suicidesper100pop,MAX(gdp_per_capita) AS gdp_per_capita FROM suicidedata GROUP BY country,year) AS derivedTable GROUP BY year;")
    
    output = {}
    for result in results:
        output[result['year']] = {
            'suicide_rates': int(result['suicide_rates']),
            'gdp_per_capita': int(result['gdp_per_capita'])
        }
    session.close()
    return jsonify(output)


@app.route("/api/suicides_per_100k_by_year")
def suicides_per_100k_by_year():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT year, AVG(suicidesper100pop) from suicidedata group by year order by year")
    
    output = {}
    for result in results:
        output[result['year']] = float(result['avg'])
    session.close()
    return jsonify(output)

@app.route("/api/suicides_and_hdi")
def suicides_and_hdi():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT country, AVG(derivedtable.suicide_rates) AS suicides, AVG(derivedTable.hdi) AS hdi FROM (SELECT year, country, SUM(suicidesper100pop) AS suicide_rates, MAX(hdi_for_year) AS hdi FROM suicidedata WHERE hdi_for_year <>0 GROUP BY year, country ORDER BY year) AS derivedTable GROUP BY country ;")
    
    output = {}
    for result in results:
        output[result['country']] = {
            'suicides': int(result['suicides']),
            'hdi':float(result['hdi'])
        }
    session.close()
    return jsonify(output)

@app.route("/api/yearly_suicides_and_hdi")
def yearly_suicides_and_hdi():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    results = engine.execute("SELECT year, AVG(derivedTable.suicidesper100pop) AS suicide_rates, AVG(derivedTable.hdi) AS hdi FROM (SELECT country,year,SUM(suicidesper100pop) AS suicidesper100pop,MAX(hdi_for_year) AS hdi FROM suicidedata WHERE hdi_for_year <>0 GROUP BY country,year) AS derivedTable GROUP BY year")
    
    output = {}
    for result in results:
        output[result['year']] = {
            'suicide_rates': int(result['suicide_rates']),
            'hdi': float(result['hdi'])
        }
    session.close()
    return jsonify(output)
    
if __name__ == '__main__':
    app.run(debug=True)
