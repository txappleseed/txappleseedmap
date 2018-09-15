from setuptools import setup, find_packages

setup(
    name='collectFromFile',
    version='0.1',
    packages=find_packages(),
    include_package_data=True,
    py_modules=['collectFromFile'],
    install_requires=[
        'click',
        'scipy',
        'requests',
    ],
    entry_points='''
        [console_scripts]
        collectFromFile=collectFromFile:cli
    ''',
)