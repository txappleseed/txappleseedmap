from setuptools import setup

setup(
    name='discipline_disparities_data',
    version='0.1',
    py_modules=['collectFromFile'],
    install_requires=[
        'click',
        'numpy',
        'scipy',
        'requests',
    ],
    entry_points='''
        [console_scripts]
        makedata=collectFromFile:cli
    ''',
)