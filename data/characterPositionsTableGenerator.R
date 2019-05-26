
library(foreach)
setwd("C:/GitRepo/redivecalc/data/")
data.raw = read.csv("characterPositionsList.csv", header = FALSE, as.is = TRUE, na.strings = "")
data.limited = read.csv("characterLimitedList.csv", header = FALSE, as.is = TRUE, na.strings = "")$V1

# rearrage the character list into matrix
data.mat = foreach(i=1:nrow(data.raw), .combine = "rbind") %do% {
  # read i-th row
  data.array = data.raw[i,]
  # read number of columns
  data.array.length = length(data.array) - sum(is.na(data.array))
  # read the representing name of the character
  charTitle = as.character(data.array[data.array.length-1])
  # read all character names used for search
  charNames = paste(data.array[1:(data.array.length-1)], collapse = " ")
  # read the character position
  charPosition = as.numeric(data.array[data.array.length])
  # check if the character is limited
  charLimited = as.numeric(sum(foreach(j=1:length(data.limited), .combine = "c") %do% { regexpr(data.limited[j], charNames) } != (-1)) > 0)
  # return the rearranged row
  matrix(c(charTitle, charNames, charPosition, charLimited), nrow=1, ncol=4)
}

# record column names
colnames(data.mat) = c("charTitle", "charNames", "charPosition", "charLimited")

# write matrix to csv
write.csv(data.mat, file = "characterPositionsTable.csv", row.names = FALSE, fileEncoding = "UTF-8")
