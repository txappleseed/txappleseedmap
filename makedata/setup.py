from setuptools import setup, find_packages

setup(
    name='makedata',
    version='0.1',
    packages=find_packages(),
    include_package_data=True,
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