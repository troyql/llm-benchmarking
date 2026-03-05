"""Schemas for the app, to standardise things 
"""

from typing import Literal
from pydantic import BaseModel, Field 

# ----------------------------- Tests -------------------------------

class Exemplar(BaseModel): 
  """Model for the exemplar response of a test. Used by the 'Test' class"""
  source: Literal["", "llm-output", "upload", "text"] = Field(
    default="",
    description="The type of the exemplar response"
  ) 
  content: str = Field(
    default="", 
    description="The content of the exemplar response"
  )

class Test(BaseModel): 
  """Model for storing tests"""
  name: str = Field(default="", description="Name of the file")
  id: str = Field(description="The ID of the test") 
  input: str = Field(default="", description="Test input")
  output: str = Field(
    default="", 
    description="The output given by the tool after being passed in the input"
  )
  exemplar: Exemplar = Field(
    default_factory=Exemplar,
    description="The exemplar response"
  )
  validation_method: Literal["llm-as-a-judge", "cosine"] = Field(
    default="llm-as-a-judge", 
    description="The validation method to compare the response to the exemplar"
  )

# --------------------------- Results -------------------------------

class UnitRun(BaseModel):
  """Model for unit test results"""
  test_id: str = Field(description="ID of the test being ran")
  start: float = Field(description="Time taken for tool to start test")
  end: float = Field(description="Time taken for tool to finish test")
  status: Literal["passed", "failed", "error"] = Field(
    description="Status of the test after being ran. 'Error' refers to a compilation/runtime error"
  )

class UnitStatistics(BaseModel):
  """Model for unit test time statistics"""
  average: float = Field(default=0, description="Average time to complete request") # disregarding latency
  median: float = Field(default=0, description="Median time to complete request")
  slowest: float = Field(default=0, description="Time of slowest test")

class UnitTests(BaseModel):
  runs: list[UnitRun] = Field(default_factory=list, description="Array of unit test results")
  stats: UnitStatistics = Field(default_factory=UnitStatistics)
  passed: int = Field(default=0, description="Number of unit tests passed")
  failed: int = Field(default=0, description="Number of unit tests failed")
  errors: int = Field(default=0, description="Number of unit test errors") # not sure if this should be a thing


class LoadResult(BaseModel):
  """Stub"""

class SpikeResult(BaseModel):
  """Stub"""

class ComplianceResults(BaseModel):
  """Stub"""

# can add your jailbreak stuff later too

class Results(BaseModel):
  unit_tests: UnitTests = Field(default_factory=UnitTests, description="Summary of unit tests") 

# ---------------------------- Data ----------------------------------

class Data(BaseModel): 
  """Model for data, the thing that stores everything"""
  prompt: str = Field(default="", description="Prompt used for test data generation")
  endpoint: str = Field(default="", description="URL for the tool endpoint")
  tests: list[Test] = Field(
    default_factory=list,
    description="List of all tests"
  ) 
  results: Results = Field(default_factory=Results)