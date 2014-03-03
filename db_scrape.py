#!/usr/bin/python
from bs4 import BeautifulSoup
import urllib2
import os, sys, re
import sqlite3

conn = sqlite3.connect('database.db')
db = conn.cursor()

def init():
	init_db()
	url = 'http://aviationweather.gov/products/nws/all'
	usock = urllib2.urlopen(url)
	source = usock.read()
	usock.close()
	soup = BeautifulSoup(source)
	parse(soup)

def parse(soup):
	content = soup.find('pre')
	if content is None:
		exit("Nothing")
	blob = content.get_text().split('\n')
	altitudes = [0,3000,6000,9000,12000,18000,24000,30000,34000,39000]
	for line in blob:
		if len(line) == 69 and not (line.startswith('FT')):
			# TODO - be better about filtering these columns. Either remove lamba function or regex.
			line = re.sub('[\s]{5}', ' 0000', line)
			data_strings = line.split(' ')
			data_strings = filter(lambda blank: blank != '', data_strings)
			airport_code = data_strings[0]
			for data,altitude in zip(data_strings, altitudes):
				if len(data) == 3:
					pass
				else:
					if int(data[:2]) == 99:
						# Winds are light and variable
						direction = '00'
						speed = '00'
					elif int(data[:2]) > 36:
						# Winds are OVER 99 knots. Follow WMO nomenclature: http://en.wikipedia.org/wiki/Winds_aloft
						# Subtract 50 from DD, add 100 to SS
						direction = str((int(data[:2]) - 50)) + '0'
						speed = (int(data[2:4]) + 100)
					else:
						# Standard DDss format.
						direction = data[:2] + '0'
						speed = data[2:4]
					insert_db(airport_code, altitude,direction, speed)
					#print "Airport: {} Height: {} Dir: {} Speed {}".format(airport_code, altitude, direction, speed)
			conn.commit()

def init_db():
	db.execute('''DROP TABLE IF EXISTS winds''')
	db.execute('''CREATE TABLE winds
		(airport_code STRING, altitude INTEGER, direction INTEGER, speed INTEGER)''')

def insert_db(airport_code, altitude, direction, speed):
	query = '''INSERT INTO winds VALUES ("{}","{}","{}","{}")'''.format(airport_code, altitude, direction, speed)
	db.execute(query)

if __name__ == '__main__':
		init()
